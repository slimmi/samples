<?php

namespace App\Jobs;

use App\Models\Media;
use App\Services\InstagramApplicationService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PublishMedia implements ShouldQueue
{
	use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

	/**
	 * @var \App\Models\Media
	 */
	protected $media;

	/**
	 * Create a new job instance.
	 *
	 * @return void
	 */
	public function __construct(Media $media)
	{
		$this->media = $media;
	}

	/**
	 * Execute the job.
	 *
	 * @return void
	 * @throws \Exception
	 */
	public function handle()
	{
		try {
			// Start Instagram application
			$instagramService = new InstagramApplicationService(env('INSTAGRAM_USERNAME'), env('INSTAGRAM_PASSWORD'));

			$instagramService->login();

			$instagram = $instagramService->getApplication();

			// Imitate a human
			sleep(mt_rand(1, 5));

			// Post image
			$photo = new \InstagramAPI\Media\Photo\InstagramPhoto($this->media->image_path);

			$response = $instagram->timeline->uploadPhoto($photo->getFile(), [
				'caption' => $this->media->caption,
			]);

			// Store code and publish date
			$this->media->short_code = $response->getMedia()->getCode();

			$this->media->published_at = Carbon::now();

			$this->media->save();
		} catch (\Exception $e) {
			$this->media->has_error = true;

			$this->media->error_message = $e->getMessage();

			$this->media->save();

			throw $e;
		}
	}

	/**
	 * The job failed to process.
	 *
	 * @param  \Exception $exception
	 * @return void
	 */
	public function failed(\Exception $exception)
	{
		// Send user notification of failure, etc...
	}
}
