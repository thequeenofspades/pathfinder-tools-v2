import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appStopClick]'
})
export class StopClickDirective {

  constructor(el: ElementRef) {
  }

  @HostListener('click', ["$event"]) onClick(event: any) {
  	event.stopPropagation();
  }

}
