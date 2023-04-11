import {
	ChangeDetectionStrategy,
	Component,
	ElementRef, Inject,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewEncapsulation,
} from '@angular/core';
import lottie, {AnimationItem} from 'lottie-web';
import {ConfigToken} from '../tokens/config.token';
import {ILottieConfig} from '../interfaces/config.interface';

@Component({
	selector: '[b-ui-lottie]',
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class LottieComponent implements OnChanges, OnDestroy {
	/**
	 * Provide JSON file name without extension (.json).
	 */
	@Input() animation: string;

	private _lottie: AnimationItem;

	constructor(
		private elementRef: ElementRef,
		@Inject(ConfigToken) private config: ILottieConfig,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.animation) {
			this._loadAnimation();
		}
	}

	ngOnDestroy() {
		this._destroyAnimation();
	}

	private _destroyAnimation(): void {
		this._lottie?.destroy();
	}

	private _resolvePath(): string {
		if (!this.animation || !this.config.baseDir) {
			return;
		}

		return `${this.config.baseDir}${this.animation}.json`;
	}

	private _loadAnimation() {
		// ...
	}
}
