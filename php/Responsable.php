<?php

namespace App\Responses;

use Illuminate\Http\Request;

abstract class Responsable implements \Illuminate\Contracts\Support\Responsable
{
	/**
	 * Prepare a response for web-site.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @return \Illuminate\Http\Response
	 */
	abstract public function toAPI(Request $request);

	/**
	 * Prepare a response for API.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @return \Illuminate\Http\Response
	 */
	abstract public function toWeb(Request $request);

	public function toResponse($request)
	{
		if (isWeb()) {
			return $this->toWeb($request);
		}

		if (isAPI()) {
			return $this->toAPI($request);
		}

		return null;
	}
}
