output "vpc_id" {
  value = aws_vpc.hospeech_vpc.id
}

output "private_subnet_ids" {
  value = aws_subnet.hospeech_private_subnet.*.id
}

output "public_subnet_ids" {
  value = aws_subnet.hospeech_public_subnet.*.id
}
