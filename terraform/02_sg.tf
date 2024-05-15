module "hospeech_sg" {

  source      = "./modules/sg"
  vpc_id      = module.hospeech_vpc.vpc_id
  prefix_name = var.prefix_name

}

