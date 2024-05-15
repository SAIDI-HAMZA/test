resource "aws_vpc" "hospeech_vpc" {
  cidr_block           = var.vpc_cidr
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "${var.prefix_name}_vpc"
  }
}

resource "aws_internet_gateway" "hospeech_igw" {
  vpc_id = aws_vpc.hospeech_vpc.id
  tags = {
        Name ="${var.prefix_name}_igw"
    }
}

resource "aws_subnet" "hospeech_public_subnet" {
  count = var.subnet_count.public
  vpc_id =  aws_vpc.hospeech_vpc.id
  cidr_block = var.public_subnet_cidr_blocks[count.index]
  availability_zone = var.azs[count.index]
   tags = {
        Name ="${var.prefix_name}_public_subnet_${count.index}"
    }
}

resource "aws_subnet" "hospeech_private_subnet" {
  count = var.subnet_count.private
  vpc_id =  aws_vpc.hospeech_vpc.id
  cidr_block = var.private_subnet_cidr_blocks[count.index]
  availability_zone = var.azs[count.index]
   tags = {
        Name ="${var.prefix_name}_private_subnet_${count.index}"
    }
}

resource "aws_route_table" "hospeech_public_rt" {
    
  vpc_id =  aws_vpc.hospeech_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.hospeech_igw.id
  }
  
}
resource "aws_route_table_association" "public" {
  count = var.subnet_count.public
  route_table_id = aws_route_table.hospeech_public_rt.id
  subnet_id = aws_subnet.hospeech_public_subnet[count.index].id
}

resource "aws_route_table" "hospeech_private_rt" {
    
  vpc_id =  aws_vpc.hospeech_vpc.id

}
resource "aws_route_table_association" "private" {
  count = var.subnet_count.private
  route_table_id = aws_route_table.hospeech_private_rt.id
  subnet_id = aws_subnet.hospeech_private_subnet[count.index].id
}