<?php

namespace App\Auth;

use App\Models\User\Token;
use Illuminate\Auth\Events\Logout;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Response;

class TokenGuard extends \Illuminate\Auth\TokenGuard
{
	/**
	 * Indicates if the logout method has been called.
	 *
	 * @var bool
	 */
	protected $loggedOut = false;

	/**
	 * @var string
	 */
	protected $signatureKey = 'signature';

	/**
	 * Create a new authentication guard.
	 *
	 * @param  \Illuminate\Contracts\Auth\UserProvider $provider
	 * @param  \Illuminate\Http\Request                $request
	 *
	 * @return void
	 */
	public function __construct(UserProvider $provider, Request $request)
	{
		parent::__construct($provider, $request);

		$this->inputKey = 'token';
		$this->storageKey = 'token';
	}

	// ...

	/**
	 * Check the signature that a client provided to prove reliability of the request.
	 *
	 * @return void
	 */
	public function validateSignature()
	{
		$signatureCalculated = '';

		$signature = $this->request->get($this->signatureKey, null);

		$parameters = $this->request->except($this->signatureKey);

		if (is_null($signature)) {
			abort(Response::HTTP_BAD_REQUEST, 'Signature needed.');
		}

		foreach ($parameters as $parameter => $value) {
			$signatureCalculated .= $parameter.'='.$value;
		}

		$signatureCalculated = hash_hmac('sha256', $signatureCalculated, 'secret');

		if (! hash_equals($signature, $signatureCalculated)) {
			abort(Response::HTTP_BAD_REQUEST, 'Signature invalid.');
		}
	}

	// ...
}
