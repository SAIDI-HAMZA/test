resource "aws_security_group" "hospeech_web_sg" {
  name ="hospeech_web_sg"
  description = "Security group for hosspeech web servers"
   vpc_id =  var.vpc_id
   ingress {
    from_port = "80"
    to_port =  "80"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
   }
   ingress {
    from_port = "8080"
    to_port =  "8080"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
   }
   ingress {
    from_port = "3000"
    to_port =  "3000"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
   }
   ingress {
    from_port = "22"
    to_port =  "22"
    protocol = "tcp"
    #cidr_blocks = ["${var.my_ip}/32"]
    cidr_blocks = ["0.0.0.0/0"]
   }
   egress {
    from_port = 0
    to_port =  0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
   }
   tags = {
     Name = "${var.prefix_name}_web_sg"
   }
}

resource "aws_security_group" "hospeech_db_sg" {
  name ="hospeech_db_sg"
  description = "Security group for hosspeech database"
   vpc_id =  var.vpc_id
   ingress {
    from_port = "5432"
    to_port =  "5432"
    protocol = "tcp"
    security_groups = [aws_security_group.hospeech_web_sg.id]
   }
   
   tags = {
     Name = "${var.prefix_name}_db_sg"
   }
}