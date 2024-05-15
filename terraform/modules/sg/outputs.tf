output "db_sg_id" {
  value = aws_security_group.hospeech_db_sg.id
}

output "web_sg_id" {
  value = aws_security_group.hospeech_web_sg.id
}
