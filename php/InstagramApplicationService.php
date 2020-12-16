<?php

namespace App\Services;

use InstagramAPI\Instagram;

class InstagramApplicationService
{
	/**
	 * @var boolean
	 */
	protected $debug = true;

	/**
	 * @var boolean
	 */
	protected $truncatedDebug = false;

	/**
	 * @var \InstagramAPI\Instagram
	 */
	protected $instagram;

	/**
	 * @var string
	 */
	protected $storagePath = 'app/instagram/accounts';

	/**
	 * @var string
	 */
	protected $username;

	/**
	 * @var string
	 */
	protected $password;

	/**
	 * InstagramService constructor.
	 *
	 * @param bool $autoLogin
	 * @throws \Exception
	 */
	public function __construct($username, $password, $isPasswordEncrypted = true)
	{
		if (empty($username)) {
			throw new \Exception('Username is required');
		}

		if (empty($password)) {
			throw new \Exception('Password is required');
		}

		if ($isPasswordEncrypted) {
			$password = decrypt($password);
		}

		$this->username = $username;
		$this->password = $password;
	}

	/**
	 * @return \InstagramAPI\Response\LoginResponse|null
	 * @throws \Exception
	 */
	public function login()
	{
		$instagram = $this->getApplication();

		return $instagram->login($this->username, $this->password, mt_rand(720, 1800));
	}

	/**
	 * @return \InstagramAPI\Instagram
	 * @throws \Exception
	 */
	public function getApplication()
	{
		if (is_null($this->instagram)) {
			$this->instagram = new Instagram($this->debug, $this->truncatedDebug, [
				'storage'    => 'file',
				'basefolder' => storage_path($this->storagePath),
			]);
		}

		return $this->instagram;
	}

	/**
	 * @param bool $debug
	 */
	public function setDebug(bool $debug): void
	{
		$this->debug = $debug;
	}

	/**
	 * @param bool $truncatedDebug
	 */
	public function setTruncatedDebug(bool $truncatedDebug): void
	{
		$this->truncatedDebug = $truncatedDebug;
	}
}
