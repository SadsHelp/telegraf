/** @format */

import { Chat, Message, Typegram, Update } from 'typegram'
import { MessageSubTypes, MessageSubTypesMapping } from './context'

// internal type provisions
export * from 'typegram/callback'
export * from 'typegram/inline'
export * from 'typegram/manage'
export * from 'typegram/message'
export * from 'typegram/passport'
export * from 'typegram/payment'
export * from 'typegram/update'

// telegraf input file definition
export interface InputFileByPath {
  source: string
}
export interface InputFileByReadableStream {
  source: NodeJS.ReadableStream
}
export interface InputFileByBuffer {
  source: Buffer
}
export interface InputFileByURL {
  url: string
  filename?: string
}
export type InputFile =
  | InputFileByPath
  | InputFileByReadableStream
  | InputFileByBuffer
  | InputFileByURL

// typegram proxy type setup
type TelegrafTypegram = Typegram<InputFile>

export type Telegram = TelegrafTypegram['Telegram']
export type Opts<M extends keyof Telegram> = TelegrafTypegram['Opts'][M]
export type InputMedia = TelegrafTypegram['InputMedia']
export type InputMediaPhoto = TelegrafTypegram['InputMediaPhoto']
export type InputMediaVideo = TelegrafTypegram['InputMediaVideo']
export type InputMediaAnimation = TelegrafTypegram['InputMediaAnimation']
export type InputMediaAudio = TelegrafTypegram['InputMediaAudio']
export type InputMediaDocument = TelegrafTypegram['InputMediaDocument']

// tiny helper types
export type ChatAction = Opts<'sendChatAction'>['action']
export type ChatType = Chat['type']

/**
 * Sending video notes by a URL is currently unsupported
 */
export type InputFileVideoNote = Exclude<InputFile, InputFileByURL>

// extra types
/**
 * Create an `Extra*` type from the arguments of a given method `M extends keyof Telegram` but `Omit`ting fields with key `K` from it.
 *
 * Note that `chat_id` may not be specified in `K` because it is `Omit`ted by default.
 */
export type MakeExtra<
  M extends keyof Telegram,
  K extends keyof Omit<Opts<M>, 'chat_id'> = never
> = Omit<Opts<M>, 'chat_id' | K>

export type ExtraAddStickerToSet = MakeExtra<
  'addStickerToSet',
  'name' | 'user_id'
>
export type ExtraAnimation = MakeExtra<'sendAnimation', 'animation'>
export type ExtraAnswerInlineQuery = MakeExtra<
  'answerInlineQuery',
  'inline_query_id' | 'results'
>
export type ExtraAudio = MakeExtra<'sendAudio', 'audio'>
export type ExtraContact = MakeExtra<
  'sendContact',
  'phone_number' | 'first_name'
>
export type ExtraCopyMessage = MakeExtra<
  'copyMessage',
  'from_chat_id' | 'message_id'
>
export type ExtraCreateNewStickerSet = MakeExtra<
  'createNewStickerSet',
  'name' | 'title' | 'user_id'
>
export type ExtraDice = MakeExtra<'sendDice'>
export type ExtraDocument = MakeExtra<'sendDocument', 'document'>
export type ExtraEditMessageCaption = MakeExtra<
  'editMessageCaption',
  'message_id' | 'inline_message_id' | 'caption'
>
export type ExtraEditMessageLiveLocation = MakeExtra<
  'editMessageLiveLocation',
  'message_id' | 'inline_message_id' | 'latitude' | 'longitude'
>
export type ExtraEditMessageMedia = MakeExtra<
  'editMessageMedia',
  'message_id' | 'inline_message_id' | 'media'
>
export type ExtraEditMessageText = MakeExtra<
  'editMessageText',
  'message_id' | 'inline_message_id'
>
export type ExtraGame = MakeExtra<'sendGame', 'game_short_name'>
export type NewInvoiceParameters = MakeExtra<
  'sendInvoice',
  | 'disable_notification'
  | 'reply_to_message_id'
  | 'allow_sending_without_reply'
  | 'reply_markup'
>
export type ExtraInvoice = MakeExtra<'sendInvoice', keyof NewInvoiceParameters>
export type ExtraLocation = MakeExtra<'sendLocation', 'latitude' | 'longitude'>
export type ExtraMediaGroup = MakeExtra<'sendMediaGroup', 'media'>
export type ExtraPhoto = MakeExtra<'sendPhoto', 'photo'>
export type ExtraPoll = MakeExtra<'sendPoll', 'question' | 'options' | 'type'>
export type ExtraPromoteChatMember = MakeExtra<'promoteChatMember', 'user_id'>
export type ExtraReplyMessage = MakeExtra<'sendMessage', 'text'>
export type ExtraRestrictChatMember = MakeExtra<'restrictChatMember', 'user_id'>
export type ExtraSetWebhook = MakeExtra<'setWebhook', 'url'>
export type ExtraSticker = MakeExtra<'sendSticker', 'sticker'>
export type ExtraStopPoll = MakeExtra<'stopPoll', 'message_id'>
export type ExtraVenue = MakeExtra<
  'sendVenue',
  'latitude' | 'longitude' | 'title' | 'address'
>
export type ExtraVideo = MakeExtra<'sendVideo', 'video'>
export type ExtraVideoNote = MakeExtra<'sendVideoNote', 'video_note'>
export type ExtraVoice = MakeExtra<'sendVoice', 'voice'>

// types used for inference of ctx object

/** Possible update types */
export type UpdateType = keyof ContextAliases
//                     = typeof UpdateTypes[number]
/** Possible message subtypes. Same as the properties on a message object, but with `forward_date` renamed to `forward` */
export type MessageSubType = MapSubType[MessageSubTypesUnion]
/** Possible message subtypes. Same as the properties on a message object */
export type MessageSubTypesUnion = typeof MessageSubTypes[number]
/** Lookup table to reverse the renaming performed in MessageSubTypesMapping */
type MessageSubTypesMappingReversed = ReverseMap<typeof MessageSubTypesMapping>

/** Lookup table used to do the renaming from MessageSubTypesUnion to MessageSubType */
type MapSubType = {
  [key in MessageSubTypesUnion]: MapType<typeof MessageSubTypesMapping, key>
}
/** Lookup table used to undo the renaming from MessageSubTypesUnion to MessageSubType,
    hence going from MessageSubType back to MessageSubTypesUnion */
type MapSubTypeBack = {
  [key in MessageSubType]: MapType<MessageSubTypesMappingReversed, key>
}

/** This is a container type. Instead of introducing a type variable, we use a mapped type. This seems to accelerate type inference.
    Takes (as key): an update type.
    Produces (as value): the correct update for the given update type.

    This is done via a lookup table defined below.
    Previous attempts to do this transformation directly without such a precomputed table slowed down type inference too much. */
export type UpdateProps = {
  [key in UpdateType]: {
    update: ContextAliases[key]['upd']
  }
}
/** This is a container type. Instead of introducing a type variable, we use a mapped type. This seems to accelerate type inference.
    Takes (as key): an update type.
    Produces (as value): an object that has exactly one key, this key is one of the keys in the context object, e.g. channelPost.
    The value behind that key is a required property, and it is the exact same type as the property on the context object has.

    In other words, if `ctx.channelPost` is of type `Message | undefined`, then the object behind the key `channel_post` in this container type will be
    ```
    {
      channelPost: Message
    }
    ```
    Intersecting a context type with this object will thus make the corresponding property required for the given update type.

    This is done via a lookup table defined below.
    Previous attempts to do this transformation directly without such a precomputed table slowed down type inference too much. */
export type ContextProps = {
  [key in UpdateType]: {
    [k in ContextAliases[key]['prop']]: ContextAliases[key]['ctx']
  }
}
/** This is a container type. Instead of introducing a type variable, we use a mapped type. This seems to accelerate type inference.
    Takes (as key): a messsage subtype.
    Produces (as value): an object that that has exactly one key called update.
    The value behind update is an Update.MessageUpdate. The message property on the update is further specified,
    hence narrowing down the union inside Message.

    For instance, if the given message subtype is `text`, the value behind the `text` key of this container types is:
    ```
    update: Update.MessageUpdate & {
        text: Message.TextMessage;
    };
    ```
    Intersecting a context type with this object will thus make for instance `ctx.update.message.text` a required property.

    This is done via a lookup table defined below.
    Previous attempts to do this transformation directly without such a precomputed table slowed down type inference too much. */
export type UpdateSubProps = {
  [key in MessageSubType]: {
    update: Update.MessageUpdate & ContextSubProps[key]
  }
}
/** This is a container type. Instead of introducing a type variable, we use a mapped type. This seems to accelerate type inference.
    Takes (as key): a message subtype.
    Produces (as value): an object that that has exactly one key called message.
    The value behind message is further specified, hence narrowing down the union inside Message.

    For instance, if the given message subtype is `text`, the value behind the `text` key of this container types is:
    ```
    {
      message: Message.TextMessage;
    };
    ```
    Intersecting a message type with this object with an update type will thus narrow down the message property of the update.

    This is done via a lookup table defined below.
    Previous attempts to do this transformation directly without such a precomputed table slowed down type inference too much. */
export type ContextSubProps = {
  [key in MessageSubType]: {
    message: MessageAliases[MapSubTypeBack[key]]['msg']
  }
}
/** This is a container type. Instead of introducing a type variable, we use a mapped type. This seems to accelerate type inference.
    Takes (as key): an update type.
    Produces (as value): an object that has exactly one key, this key is one of the keys in the context object, e.g. channelPost.
    The value behind that key is always undefined.

    In other words, if `ctx.channelPost` is of type `Message | undefined`, then this object will be
    ```
    {
      channelPost: undefined
    }
    ```
    Intersecting a context with this object will thus make the corresponding property undefined for the given update type.

    Some renaming has to take place. This is done via a lookup table defined below.
    Previous attempts to do this transformation directly without such a precomputed table slowed down type inference too much. */
export type AbsentProps<T extends UpdateType> = {
  [key in ContextAliases[T]['prop']]: undefined
}

// type inference shortcuts

/* These helper interfaces specify the renaming of the update properties to the
 corresponding names on the context object. It also provides manual type
 mappings to improve type inference performance. Previous developments with
 automatic type transformations do yield correct results, however, they often
 construct intermediate union types during the computation that are too complex
 to represent. They also make the type inference so slow that it is no longer
 pleasant to work with. */
interface ContextAliases {
  callback_query: {
    prop: 'callbackQuery'
    upd: Update.CallbackQueryUpdate
    ctx: Update.CallbackQueryUpdate['callback_query']
  }
  channel_post: {
    prop: 'channelPost'
    upd: Update.ChannelPostUpdate
    ctx: Update.ChannelPostUpdate['channel_post']
  }
  chosen_inline_result: {
    prop: 'chosenInlineResult'
    upd: Update.ChosenInlineResultUpdate
    ctx: Update.ChosenInlineResultUpdate['chosen_inline_result']
  }
  edited_channel_post: {
    prop: 'editedChannelPost'
    upd: Update.EditedChannelPostUpdate
    ctx: Update.EditedChannelPostUpdate['edited_channel_post']
  }
  edited_message: {
    prop: 'editedMessage'
    upd: Update.EditedMessageUpdate
    ctx: Update.EditedMessageUpdate['edited_message']
  }
  inline_query: {
    prop: 'inlineQuery'
    upd: Update.InlineQueryUpdate
    ctx: Update.InlineQueryUpdate['inline_query']
  }
  message: {
    prop: 'message'
    upd: Update.MessageUpdate
    ctx: Update.MessageUpdate['message']
  }
  pre_checkout_query: {
    prop: 'preCheckoutQuery'
    upd: Update.PreCheckoutQueryUpdate
    ctx: Update.PreCheckoutQueryUpdate['pre_checkout_query']
  }
  shipping_query: {
    prop: 'shippingQuery'
    upd: Update.ShippingQueryUpdate
    ctx: Update.ShippingQueryUpdate['shipping_query']
  }
  poll: {
    prop: 'poll'
    upd: Update.PollUpdate
    ctx: Update.PollUpdate['poll']
  }
  poll_answer: {
    prop: 'pollAnswer'
    upd: Update.PollAnswerUpdate
    ctx: Update.PollAnswerUpdate['poll_answer']
  }
}
interface MessageAliases {
  voice: {
    msg: Message.VoiceMessage
    prop: Message.VoiceMessage['voice']
  }
  video_note: {
    msg: Message.VideoNoteMessage
    prop: Message.VideoNoteMessage['video_note']
  }
  video: {
    msg: Message.VideoMessage
    prop: Message.VideoMessage['video']
  }
  animation: {
    msg: Message.AnimationMessage
    prop: Message.AnimationMessage['animation']
  }
  venue: {
    msg: Message.VenueMessage
    prop: Message.VenueMessage['venue']
  }
  text: {
    msg: Message.TextMessage
    prop: Message.TextMessage['text']
  }
  supergroup_chat_created: {
    msg: Message.SupergroupChatCreated
    prop: Message.SupergroupChatCreated['supergroup_chat_created']
  }
  successful_payment: {
    msg: Message.SuccessfulPaymentMessage
    prop: Message.SuccessfulPaymentMessage['successful_payment']
  }
  sticker: {
    msg: Message.StickerMessage
    prop: Message.StickerMessage['sticker']
  }
  pinned_message: {
    msg: Message.PinnedMessageMessage
    prop: Message.PinnedMessageMessage['pinned_message']
  }
  photo: {
    msg: Message.PhotoMessage
    prop: Message.PhotoMessage['photo']
  }
  new_chat_title: {
    msg: Message.NewChatTitleMessage
    prop: Message.NewChatTitleMessage['new_chat_title']
  }
  new_chat_photo: {
    msg: Message.NewChatPhotoMessage
    prop: Message.NewChatPhotoMessage['new_chat_photo']
  }
  new_chat_members: {
    msg: Message.NewChatMembersMessage
    prop: Message.NewChatMembersMessage['new_chat_members']
  }
  migrate_to_chat_id: {
    msg: Message.MigrateToChatIdMessage
    prop: Message.MigrateToChatIdMessage['migrate_to_chat_id']
  }
  migrate_from_chat_id: {
    msg: Message.MigrateFromChatIdMessage
    prop: Message.MigrateFromChatIdMessage['migrate_from_chat_id']
  }
  location: {
    msg: Message.LocationMessage
    prop: Message.LocationMessage['location']
  }
  left_chat_member: {
    msg: Message.LeftChatMemberMessage
    prop: Message.LeftChatMemberMessage['left_chat_member']
  }
  invoice: {
    msg: Message.InvoiceMessage
    prop: Message.InvoiceMessage['invoice']
  }
  group_chat_created: {
    msg: Message.GroupChatCreatedMessage
    prop: Message.GroupChatCreatedMessage['group_chat_created']
  }
  game: {
    msg: Message.GameMessage
    prop: Message.GameMessage['game']
  }
  dice: {
    msg: Message.DiceMessage
    prop: Message.DiceMessage['dice']
  }
  document: {
    msg: Message.DocumentMessage
    prop: Message.DocumentMessage['document']
  }
  delete_chat_photo: {
    msg: Message.DeleteChatPhotoMessage
    prop: Message.DeleteChatPhotoMessage['delete_chat_photo']
  }
  contact: {
    msg: Message.ContactMessage
    prop: Message.ContactMessage['contact']
  }
  channel_chat_created: {
    msg: Message.ChannelChatCreatedMessage
    prop: Message.ChannelChatCreatedMessage['channel_chat_created']
  }
  audio: {
    msg: Message.AudioMessage
    prop: Message.AudioMessage['audio']
  }
  connected_website: {
    msg: Message.ConnectedWebsiteMessage
    prop: Message.ConnectedWebsiteMessage['connected_website']
  }
  passport_data: {
    msg: Message.PassportDataMessage
    prop: Message.PassportDataMessage['passport_data']
  }
  poll: {
    msg: Message.PollMessage
    prop: Message.PollMessage['poll']
  }
  forward_date: {
    msg: Message.CommonMessage
    prop: Exclude<Message.CommonMessage['forward_date'], undefined>
  }
}

// util types

/** Takes: an object that maps string keys to string literal types.
    Produces: an object with keys and values flipped,
    i.e. an object mapping the string literal types to their original keys. */
type ReverseMap<
  M extends { [k in K]: V },
  K extends string | number | symbol = keyof M,
  V extends string = M[keyof M]
> = {
  [key in M[keyof M]]: {
    [k in keyof M]: key extends M[k] ? k : never
  }[keyof M]
}
type MapType<M, U> = U extends keyof M ? M[U] : U

// historical anecdotes

/* The following type could be used to eliminate the need for the type inference
 shortcut interfaces, but it slows down type inference too much and regularly
 produces too large union types. */
// type UpdateProps = {
//   [key in UpdateTypesKey]: {
//       update: tt.Update &
//       {
//         [k in key]:  UnionToIntersection<tt.Update>[key]
//       }
//   }
// }
