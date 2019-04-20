<?php defined('SYSPATH') OR die('No direct access allowed.');

/**
 * Extract colors from an image like a human would do.
 */
class Model_Image_Extractor extends Model
{
	/**
	 * @var resource
	 */
	protected $image_resource;

	/**
	 * @param    Resource $image_resource
	 * @return   void
	 */
	public function set_image($image_resource)
	{
		$this->image_resource = $image_resource;
	}

	/**
	 * Extract all used RGB colors of an image. And return
	 * the most used [$max_palette_size] colors. This process is
	 * rather hard. So use small images to extract.
	 *
	 * [Notice:]
	 *  It does not check every single pixel. It goes through every 2 pixels.
	 *
	 * @param    integer $max_palette_size amount of colors to get
	 * @param    integer $width            width
	 * @param    integer $height           height
	 * @return   array
	 */
	public function extract($max_palette_size = 1, $width = null, $height = null)
	{
		if ($width === null) {
			$width = imagesx($this->image_resource);
		}

		if ($height === null) {
			$height = imagesy($this->image_resource);
		}

		// All colors will be here
		$exists = [];
		$colors = [];

		$step = 5;

		for ($x = 0; $x + $step < $width; $x += $step) {
			for ($y = $step; $y + $step < $height; $y += $step) {
				$rgba = imagecolorsforindex($this->image_resource, imagecolorat($this->image_resource, $x, $y));

				if ($rgba['alpha'] === 127)
					continue;

				$hex = sprintf('%02x%02x%02x', $rgba['red'], $rgba['green'], $rgba['blue']);

				$sRGB = $this->getSRGBComponents([
					$rgba['red'],
					$rgba['green'],
					$rgba['blue'],
				]);

				$lab = $this->getLabFromSRGB($sRGB);

				if (! array_key_exists($hex, $exists)) {
					$exists[$hex] = 1;

					$colors[] = [
						'lab' => $lab,
						'rgb' => [
							$rgba['red'],
							$rgba['green'],
							$rgba['blue'],
						],
					];
				}
			}
		}

		// Clear memory
		unset($exists);

		// Get a cluster of colors
		$colors = $this->clustering($colors, $max_palette_size);

		$palette_size = min($max_palette_size, count($colors));

		return array_slice($colors, 0, $palette_size, true);
	}

	/**
	 * Cluster colors.
	 *
	 * @param    array   $colors           list of colors
	 * @param    integer $max_palette_size amounts of colors
	 * @return   array
	 */
	public function clustering($colors, $max_palette_size)
	{

		$colors_size = count($colors);
		$palette_size = min($max_palette_size, $colors_size);
		$minDeltaE = 100 / ($palette_size + 1);

		for ($i = 0; $i < $colors_size; $i++) {
			if (! array_key_exists($i, $colors)) {
				continue;
			}

			// Choose the current color
			$color1 = $colors[$i];
			$similar = [];

			// Always store the current color
			$similar[] = $i;

			for ($j = $i + 1; $j < $colors_size; $j++) {
				if (! array_key_exists($j, $colors)) {
					continue;
				}

				// Choose the next color
				$color2 = $colors[$j];

				if ($this->ciede2000DeltaE($color1['lab'], $color2['lab']) <= $minDeltaE) {
					$similar[] = $j;
				}
			}

			$similar_size = count($similar);

			if ($similar_size > 1) {
				// Two and more colors are similar
				// Find max and minimum
				$minR = $minG = $minB = 255;
				$maxR = $maxG = $maxB = 0;

				for ($k = 0; $k < $similar_size; $k++) {
					$index = $similar[$k];

					// Min
					if ($colors[$index]['rgb'][0] < $minR) {
						$minR = $colors[$index]['rgb'][0];
					}

					if ($colors[$index]['rgb'][1] < $minG) {
						$minG = $colors[$index]['rgb'][1];
					}

					if ($colors[$index]['rgb'][2] < $minB) {
						$minB = $colors[$index]['rgb'][2];
					}

					// Max
					if ($colors[$index]['rgb'][0] > $maxR) {
						$maxR = $colors[$index]['rgb'][0];
					}

					if ($colors[$index]['rgb'][1] > $maxG) {
						$maxG = $colors[$index]['rgb'][1];
					}

					if ($colors[$index]['rgb'][2] > $maxB) {
						$maxB = $colors[$index]['rgb'][2];
					}

					// Delete
					unset($colors[$index]);
				}

				// Make a average color
				$r = $minR + round(($maxR - $minR) / $similar_size);
				$g = $minG + round(($maxG - $minG) / $similar_size);
				$b = $minB + round(($maxB - $minB) / $similar_size);
			} else {
				$index = $similar[0];
				$r = $colors[$index]['rgb'][0];
				$g = $colors[$index]['rgb'][1];
				$b = $colors[$index]['rgb'][2];

				// Delete
				unset($colors[$index]);
			}

			$hex = sprintf('%02x%02x%02x', $r, $g, $b);

			$colors_final_size[$hex] = $similar_size;

			$colors_final[$hex] = [
				'rgb' => [
					$r,
					$g,
					$b,
				],
			];
		}

		// Clear
		$colors = [];

		$colors_size = count($colors_final_size);

		foreach ($colors_final_size as $hex => $count) {
			$colors_final_size[$hex] = (int) round($this->getColorScore([
					$colors_final[$hex]['rgb'][0],
					$colors_final[$hex]['rgb'][1],
					$colors_final[$hex]['rgb'][2],
				], $count, $colors_size) * 10000);
		}

		arsort($colors_final_size, SORT_NUMERIC);

		foreach ($colors_final_size as $hex => $score) {
			$colors[] = [
				'rgb'   => $colors_final[$hex]['rgb'],
				'score' => $score,
			];
		}

		return $colors;
	}

	// ...

}
