resource "aws_iam_role" "limited-hospeech_role" {
  name = "limited-hospeech_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })


  tags = {
    tag-key = "tag-value"
  }
}

resource "aws_iam_instance_profile" "hospeech_profile_4" {
  name = "hospeech_instance_profile_4"
  role = aws_iam_role.limited-hospeech_role.name
}

resource "aws_iam_role_policy" "hospeech_policy" {
  name = "hospeech_policy"
  role = aws_iam_role.limited-hospeech_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:*"]
        Effect   = "Allow"
        Resource = "*"
      },{
        Action   = ["polly:*"]
        Effect   = "Allow"
        Resource = "*"
      },{
        Action   = ["transcribe:*"]
        Effect   = "Allow"
        Resource = "*"
      },{
        Action   = ["translate:*"]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

