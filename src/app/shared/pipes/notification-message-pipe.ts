import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationMessage',
})
export class NotificationMessagePipe implements PipeTransform {
  transform(type: string): string {

    if (!type) return '';

    const [action, entity] = type.split('_');

    const pastAction = `${action}d`;

    const target = entity === 'post' ? 'your' : 'you';

    return entity === 'post'
      ? `${pastAction} ${target} post`
      : `${pastAction} ${target}`;
  }
}
