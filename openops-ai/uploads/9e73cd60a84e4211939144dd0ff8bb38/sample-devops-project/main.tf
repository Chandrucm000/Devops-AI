terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "application_data" {
  bucket_prefix = "openops-demo-data-"

  tags = {
    Project     = "openops-demo"
    Environment = var.environment
  }
}
