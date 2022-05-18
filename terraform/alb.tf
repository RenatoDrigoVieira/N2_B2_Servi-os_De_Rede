resource "aws_alb" "containers_cheguei_lb" {
  subnets         = [aws_subnet.containers_cheguei_subnet.id, aws_subnet.containers_cheguei_subnet_az_1b.id]
  security_groups = [aws_security_group.containers_cheguei_security_group.id]
}

# Basic https lisener to demo HTTPS certiciate
resource "aws_alb_listener" "containers_cheguei_lb_https" {
  load_balancer_arn = aws_alb.containers_cheguei_lb.arn
  certificate_arn   = aws_acm_certificate_validation.cert.certificate_arn
  port              = "443"
  protocol          = "HTTPS"
  # Default action, and other paramters removed for BLOG
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.containers_cheguei_instances.arn
  }
}

resource "aws_lb_target_group" "containers_cheguei_instances" {
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.containers_cheguei_vpc.id
}

resource "aws_lb_target_group_attachment" "containers_cheguei_lb_attachment" {
  target_group_arn = aws_lb_target_group.containers_cheguei_instances.arn
  target_id        = aws_instance.containers_cheguei_instance.id
  port             = 80
}

# Always good practice to redirect http to https
resource "aws_alb_listener" "containers_cheguei_lb_http" {
  load_balancer_arn = aws_alb.containers_cheguei_lb.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}