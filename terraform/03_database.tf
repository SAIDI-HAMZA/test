resource "aws_db_subnet_group" "hospeech_db_subnet_group" {
  name        = "hospeech_db_subnet_group"
  description = "DB subnet group for hospeech"
  subnet_ids  = module.hospeech_vpc.private_subnet_ids
}

resource "aws_db_instance" "hospeech_database" {
  allocated_storage      = var.settings.database.allocated_storage
  engine                 = var.settings.database.engine
  engine_version         = var.settings.database.engine_version
  instance_class         = var.settings.database.instance_class
  db_name                = var.settings.database.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.hospeech_db_subnet_group.id
  vpc_security_group_ids = [module.hospeech_sg.db_sg_id]
  skip_final_snapshot    = var.settings.database.skip_final_snapshot

}

output "db_instance_endpoint" {
  description = "The connection endpoint"
  value       = try(aws_db_instance.hospeech_database.endpoint, null)
}