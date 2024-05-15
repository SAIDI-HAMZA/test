resource "aws_key_pair" "hospeech_kp" {
  key_name   = "hospeech_kp"
  public_key = file("./ssh/id_rsa_aws.pub")
}

resource "aws_instance" "hospeech_web" {
  count                  = var.settings.web_app.count
  ami                    = "ami-074254c177d57d640"
  instance_type          = var.settings.web_app.instance_type
  subnet_id              = module.hospeech_vpc.public_subnet_ids[count.index]
  key_name               = aws_key_pair.hospeech_kp.key_name
  vpc_security_group_ids = [module.hospeech_sg.web_sg_id]
  iam_instance_profile   = aws_iam_instance_profile.hospeech_profile_4.name


  tags = {
    Name = "hospeech_web_${count.index}"
  }
}

resource "aws_eip" "hospeech_web_eip" {
  count    = var.settings.web_app.count
  instance = aws_instance.hospeech_web[count.index].id
  domain   = "vpc"
  tags = {
    Name = "hospeech_web_eip_${count.index}"
  }
}
resource "null_resource" "app" {


  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file("./ssh/id_rsa_aws")
    host        = aws_eip.hospeech_web_eip[0].public_ip
  }

  provisioner "file" {
    source      = "../dist"        # terraform machine
    destination = "/home/ec2-user/" # remote machine
  }

  provisioner "file" {
    source      = "../prisma"        # terraform machine
    destination = "/home/ec2-user/" # remote machine
  }

  provisioner "file" {
    source      = "../.env.prod"             # terraform machine
    destination = "/home/ec2-user/.env" # remote machine
  }

  provisioner "file" {
    source      = "../package.json"                  # terraform machine
    destination = "/home/ec2-user/package.json" # remote machine
  }

 provisioner "file" {
    source      = "../package-lock.json"                  # terraform machine
    destination = "/home/ec2-user/package-lock.json" # remote machine
  }

  provisioner "file" {
    source      = "../tsconfig.json"                  # terraform machine
    destination = "/home/ec2-user/tsconfig.json" # remote machine
  }

  provisioner "remote-exec" {
    inline = [
      "sudo mkdir /home/ec2-user/scripts",
      "sudo chown ec2-user:ec2-user /home/ec2-user/scripts",
      "sudo chmod -R 777 /home/ec2-user/scripts",
    ]
  }
  provisioner "file" {
    content = templatefile("./scripts/install_ec2.sh.tftpl", {
      "aws_region"   = "${var.aws_region}",
      "bucket_name"  = "${var.bucket_name}",
      "db_username"  = "${var.db_username}",
      "db_passwword" = "${var.db_password}",
      "db_name"      = "${var.db_name}",
    #"public_ip" = "${aws_eip.hospeech_web_eip[0].public_ip}",
    "endpoint" = "${aws_db_instance.hospeech_database.endpoint}",
    pg_hba_file    = templatefile("./scripts/pg_hba.conf", { allowed_ip = "0.0.0.0/0" }), }) # terraform machine
    destination = "/home/ec2-user/scripts/install_ec2.sh"       # remote machine
  }


  provisioner "remote-exec" {
    inline = [
      "sudo chmod -R 777 /home/ec2-user/scripts/install_ec2.sh",
      "sh /home/ec2-user/scripts/install_ec2.sh",
    ]
  }
}
