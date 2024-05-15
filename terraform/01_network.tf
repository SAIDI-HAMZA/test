module "hospeech_vpc" {

  source                     = "./modules/vpc"
  vpc_cidr                   = var.vpc_cidr_block
  prefix_name                = var.prefix_name
  subnet_count               = var.subnet_count
  public_subnet_cidr_blocks  = var.public_subnet_cidr_blocks
  private_subnet_cidr_blocks = var.private_subnet_cidr_blocks
  azs                        = data.aws_availability_zones.available.names
}