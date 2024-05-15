variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "prefix_name" {}

variable "public_subnet_cidr_blocks" {
type        = list(string)
  default     = []
 }

variable "private_subnet_cidr_blocks" {
  type        = list(string)
  default     = []
}

variable "subnet_count" {
  description = "Number of subnets"
  type        = map(number)

}

variable "azs" {
  type        = list(string)
  default     = []
  description = "Aws region availability zones"
}