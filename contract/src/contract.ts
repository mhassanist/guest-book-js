import { NearBindgen, near, call, view } from "near-sdk-js"
import { POINT_ONE, PostedMessage } from "./model"

@NearBindgen({})
class GuestBook {
  messages: PostedMessage[] = []

  @call
  // Public - Adds a new message.
  add_message({ text }: { text: string }) {
    // If the user attaches more than 0.01N the message is premium
    const premium = near.attachedDeposit() >= BigInt(POINT_ONE)
    const sender = near.predecessorAccountId()

    const message = new PostedMessage({ premium, sender, text })
    this.messages.push(message)
  }

  @view
  // Returns an array of messages.
  get_messages(): PostedMessage[] {
    if (this.messages.length <= 20) {
      return this.messages.reverse()
    } else {
      return this.messages.slice(-20).reverse()
    }
  }
}
