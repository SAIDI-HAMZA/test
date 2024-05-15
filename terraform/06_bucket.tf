module "hospeech_bucket" {

  source = "./modules/bucket"
  name   = var.bucket_name

}