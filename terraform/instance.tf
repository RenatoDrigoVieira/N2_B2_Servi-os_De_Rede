provider "aws" {
  region = "sa-east-1"
}

# Below resource is to create public key
resource "tls_private_key" "sskeygen_execution" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Below are the aws key pair
resource "aws_key_pair" "containers_cheguei_key_pair" {
  depends_on = [tls_private_key.sskeygen_execution]
  key_name   = "containers_cheguei_key"
  public_key = tls_private_key.sskeygen_execution.public_key_openssh
}

resource "aws_instance" "containers_cheguei_instance" {
  # Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
  ami           = "ami-0800f9916b7655289"
  instance_type = "t2.micro"
  key_name      = "containers_cheguei_key"

  vpc_security_group_ids = ["${aws_security_group.containers_cheguei_security_group.id}"]
  subnet_id              = aws_subnet.containers_cheguei_subnet.id

  tags = {
    Name        = "${var.namespace}_ec2"
    Environment = "${var.env}"
  }

  # Ensure create its ssh private key when running terraform apply locally
  provisioner "local-exec" {
    command = "echo '${tls_private_key.sskeygen_execution.private_key_pem}' >> ${aws_key_pair.containers_cheguei_key_pair.id}.pem ; chmod 400 ${aws_key_pair.containers_cheguei_key_pair.id}.pem"
  }

  # Install docker and initialize prometheus and grafana containers *ONLY WHEN CREATES THE IN
  connection {
    type        = "ssh"
    user        = "ec2-user"
    host        = self.public_ip
    private_key = tls_private_key.sskeygen_execution.private_key_pem
  }

  # Copy the prometheus file to instance
  provisioner "file" {
    source      = "./config/prometheus.yml"
    destination = "/tmp/prometheus.yml"
  }

  # Copy the docker daemon json to instance
  provisioner "file" {
    source      = "./config/daemon.json"
    destination = "/tmp/daemon.json"
  }

  # Copy nginx config to instance
  provisioner "file" {
    source      = "./config/nginx.conf"
    destination = "/tmp/nginx.conf"
  }
  
  # execute startup script
  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      # install nginx
      "sudo amazon-linux-extras install nginx1 -y",
      # install docker
      "sudo amazon-linux-extras install docker -y",
      # run nginx
      "sudo systemctl enable nginx",
      "sudo service nginx start",
      "sudo rm -rf /etc/nginx/nginx.conf",
      "sudo cp /tmp/nginx.conf /etc/nginx/.",
      "sudo service nginx restart",
      # run docker
      "sudo cp /tmp/daemon.json /etc/docker/.",
      "sudo service docker start",
      "sudo systemctl enable docker",
      "sudo usermod -a -G docker ec2-user",
      # node exporter
      "node_exporter_version=1.3.1",
      "wget https://github.com/prometheus/node_exporter/releases/download/v$node_exporter_version/node_exporter-$node_exporter_version.linux-amd64.tar.gz",
      "tar xvfz node_exporter-$node_exporter_version.linux-amd64.tar.gz",
      "cd  node_exporter-$node_exporter_version.linux-amd64",
      "nohup ./node_exporter >> ./node_exporter.log &",
      # run prometheus and grafana through docker
      "sudo mkdir /prometheus-data",
      "sudo cp /tmp/prometheus.yml /prometheus-data/.",
      "sudo sed -i 's;<access_key>;${aws_iam_access_key.prometheus_access_key.id};g' /prometheus-data/prometheus.yml",
      "sudo sed -i 's;<secret_key>;${aws_iam_access_key.prometheus_access_key.secret};g' /prometheus-data/prometheus.yml",
      "sudo docker run -d --name=prometheus --net=host -v /prometheus-data/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus",
      "sudo docker run -d --net=host -e --name=grafana grafana/grafana"
    ]
  }
}
