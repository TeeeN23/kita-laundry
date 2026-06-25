class WhatsappNotificationJob < ApplicationJob
  queue_as :default

  def perform(phone, template_name)
    WhatsappService.new.send_template_message(phone, template_name)
  end
end
