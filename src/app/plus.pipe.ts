import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plus'
})
export class PlusPipe implements PipeTransform {

  transform(value: number, args?: any): any {
  	if (value == null) return '';
    if (value >= 0) {
    	return '+' + value.toString();
    } else {
    	return value.toString();
    }
  }

}
