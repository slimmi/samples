import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output()
  public onFileDropped = new EventEmitter<any>();

  @HostBinding('class.input--drag-drop')
  public isActive = false;

  constructor() {}

  @HostListener('dragover', ['$event'])
  public onDragOver(event): void {
    event.preventDefault();
    event.stopPropagation();

    this.isActive = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(event): void {
    event.preventDefault();
    event.stopPropagation();

    this.isActive = false;

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

}
