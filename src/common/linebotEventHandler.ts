import 'reflect-metadata';

declare type eventType =
  | 'message'
  | 'unsend'
  | 'follow'
  | 'unfollow'
  | 'join'
  | 'leave'
  | 'memberJoined'
  | 'memberLeft'
  | 'postback'
  | 'videoPlayComplete'
  | 'beacon'
  | 'AccountLinkEvent'
  | 'DeviceLinkEvent'
  | 'things';

export const EVENT_TYPE_METADATA = 'eventType';

export function linebotEventHandler(event: eventType): MethodDecorator {
  return <T>(
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    Reflect.defineMetadata(EVENT_TYPE_METADATA, event, descriptor.value);
  };
}
