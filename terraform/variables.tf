variable "namespace" {
  description = "The project namespace to use for unique resource naming"
  type        = string
  default     = "containers-cheguei"
}

variable "env" {
  description = "The environment which is running"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "The cidr block that belongs to default vpc"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "The cidr block that belongs to default subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "dns_base_domain" {
  default     = "cheguei.app"
  type        = string
  description = "DNS Zone name to be used from containers.cheguei subdomain."
}

variable "prometheus_access_name" {
  default     = "prometheus_ec2_access"
  type        = string
  description = "IAM access name to be used by prometheus"
}