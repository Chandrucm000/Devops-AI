output "data_bucket_name" {
  value       = aws_s3_bucket.application_data.bucket
  description = "Name of the application data bucket"
}
