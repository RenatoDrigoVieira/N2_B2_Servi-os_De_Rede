data "aws_availability_zones" "available" {}

#Create the project vpc
resource "aws_vpc" "containers_cheguei_vpc" {
  cidr_block = var.vpc_cidr

  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name        = "${var.namespace}_vpc"
    Environment = "${var.env}"
  }
}

#Create security group for containers cheguei VPC
resource "aws_security_group" "containers_cheguei_security_group" {
  name        = "containers_cheguei_security_group"
  description = "Security group for containers cheguei"

  vpc_id = aws_vpc.containers_cheguei_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Promethus UI
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Grafana access for 3000
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # API access for 8080
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH access for 22
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound to Internet to install Docker Images?
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow ping from anywhere
  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 8
    to_port     = 0
    protocol    = "icmp"
    description = "Allow ping from anywhere"
  }

  tags = {
    Name        = "${var.namespace}_sg"
    Environment = "${var.env}"
  }
}

# Create subnet for this VPC
resource "aws_subnet" "containers_cheguei_subnet" {
  vpc_id            = aws_vpc.containers_cheguei_vpc.id
  cidr_block        = var.subnet_cidr
  availability_zone = "sa-east-1a"
  # to create a public ipv4/dns address to ec2 attached to it
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.namespace}_subnet"
    Environment = "${var.env}"
  }
}

# VPC on another az
resource "aws_subnet" "containers_cheguei_subnet_az_1b" {
  vpc_id            = aws_vpc.containers_cheguei_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "sa-east-1b"
  # to create a public ipv4/dns address to ec2 attached to it
  map_public_ip_on_launch = true
}


## PUBLIC ETHERNET STUFF

# Create an internet gateway to give our subnet access to the outside world
resource "aws_internet_gateway" "containers_cheguei_ig" {
  vpc_id = aws_vpc.containers_cheguei_vpc.id

  tags = {
    Name        = "${var.namespace}_ig"
    Environment = "${var.env}"
  }

}

# Grant the VPC internet access on its main route table
resource "aws_route" "containers_cheguei_internet_access" {
  route_table_id         = aws_vpc.containers_cheguei_vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.containers_cheguei_ig.id
}

resource "aws_route_table" "containers_cheguei_route_table" {
  vpc_id = aws_vpc.containers_cheguei_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.containers_cheguei_ig.id
  }
  tags = {
    Name        = "${var.namespace}_route_table"
    Environment = "${var.env}"
  }
}

resource "aws_route_table_association" "containers_cheguei_route_table_association" {
  subnet_id      = aws_subnet.containers_cheguei_subnet.id
  route_table_id = aws_route_table.containers_cheguei_route_table.id
}
