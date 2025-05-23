variable "workspace_sid" {
  type        = string
  description = "TaskRouter workspace SID"
  validation {
    condition     = length(var.workspace_sid) > 2 && substr(var.workspace_sid, 0, 2) == "WS"
    error_message = "workspace_sid expected to start with \"WS\"."
  }
}

variable "voice_channel_sid" {
  type        = string
  description = "SID of voice task channel"
  validation {
    condition     = length(var.voice_channel_sid) > 2 && substr(var.voice_channel_sid, 0, 2) == "TC"
    error_message = "voice_channel_sid expected to start with \"TC\"."
  }
}

variable "queue_sid" {
  type        = string
  description = "SID of callbacks queue"
  validation {
    condition     = length(var.queue_sid) > 2 && substr(var.queue_sid, 0, 2) == "WQ"
    error_message = "queue_sid expected to start with \"WQ\"."
  }
}

variable "serverless_domain" {
  type        = string
  description = "serverless domain for flex plugin"
  validation {
    condition     = length(var.serverless_domain) > 34 && substr(var.serverless_domain, 0, 37) == "custom-flex-extensions-serverless-zd-"
    error_message = "serverless_domain expected to start with \"custom-flex-extensions-serverless-zd-\"."
  }
}

variable "serverless_sid" {
  type        = string
  description = "serverless sid"
  validation {
    condition     = length(var.serverless_sid) > 2 && substr(var.serverless_sid, 0, 2) == "ZS"
    error_message = "serverless_sid expected to start with \"ZS\"."
  }
}

variable "serverless_env_sid" {
  type        = string
  description = "serverless env sid"
  validation {
    condition     = length(var.serverless_env_sid) > 2 && substr(var.serverless_env_sid, 0, 2) == "ZE"
    error_message = "serverless_env_sid expected to start with \"ZE\"."
  }
}

variable "function_create_callback" {
  type        = string
  description = "create callback function sid"
  validation {
    condition     = length(var.function_create_callback) > 2 && substr(var.function_create_callback, 0, 2) == "ZH"
    error_message = "function_create_callback expected to start with \"ZH\"."
  }
}