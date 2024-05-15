resource "aws_s3_bucket" "hospeech_bucket" {
  bucket = var.name

  tags = {
    Name        = var.name
  }
}