#!/bin/bash

# Script to manage deletion protection on production DynamoDB tables
# This script helps protect production tables from accidental deletion

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if AWS CLI is available
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
}

# Function to check AWS credentials
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials are not configured. Please run 'aws configure' first."
        exit 1
    fi
}

# Function to list production tables
list_production_tables() {
    print_status "Listing production DynamoDB tables..."
    aws dynamodb list-tables --query "TableNames[?starts_with(@, 'Tt3Prod')]" --output table
}

# Function to enable deletion protection on a table
enable_deletion_protection() {
    local table_name="$1"
    print_status "Enabling deletion protection on table: $table_name"
    
    if aws dynamodb update-table --table-name "$table_name" --deletion-protection-enabled; then
        print_status "Successfully enabled deletion protection on $table_name"
    else
        print_error "Failed to enable deletion protection on $table_name"
        return 1
    fi
}

# Function to disable deletion protection on a table
disable_deletion_protection() {
    local table_name="$1"
    print_warning "Disabling deletion protection on table: $table_name"
    
    if aws dynamodb update-table --table-name "$table_name" --deletion-protection-disabled; then
        print_status "Successfully disabled deletion protection on $table_name"
    else
        print_error "Failed to disable deletion protection on $table_name"
        return 1
    fi
}

# Function to check deletion protection status
check_deletion_protection() {
    local table_name="$1"
    local status
    status=$(aws dynamodb describe-table --table-name "$table_name" --query "Table.DeletionProtectionEnabled" --output text 2>/dev/null || echo "ERROR")
    
    if [ "$status" = "True" ]; then
        echo -e "${GREEN}✓${NC} $table_name - Protected"
    elif [ "$status" = "False" ]; then
        echo -e "${RED}✗${NC} $table_name - Not Protected"
    else
        echo -e "${RED}?${NC} $table_name - Error checking status"
    fi
}

# Function to check all production tables protection status
check_all_production_tables() {
    print_status "Checking deletion protection status for all production tables..."
    
    local tables
    tables=$(aws dynamodb list-tables --query "TableNames[?starts_with(@, 'Tt3Prod')]" --output text)
    
    for table in $tables; do
        check_deletion_protection "$table"
    done
}

# Function to enable deletion protection on all production tables
protect_all_production_tables() {
    print_status "Enabling deletion protection on all production tables..."
    
    local tables
    tables=$(aws dynamodb list-tables --query "TableNames[?starts_with(@, 'Tt3Prod')]" --output text)
    
    for table in $tables; do
        enable_deletion_protection "$table"
    done
    
    print_status "All production tables are now protected!"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  list                    List all production DynamoDB tables"
    echo "  status                  Check deletion protection status for all production tables"
    echo "  protect                 Enable deletion protection on all production tables"
    echo "  protect-table TABLE     Enable deletion protection on a specific table"
    echo "  unprotect-table TABLE   Disable deletion protection on a specific table (use with caution!)"
    echo "  help                    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 list                 # List all production tables"
    echo "  $0 status               # Check protection status"
    echo "  $0 protect              # Protect all production tables"
    echo "  $0 protect-table Tt3Production-EntityTable-123 # Protect specific table"
}

# Main script logic
main() {
    # Check prerequisites
    check_aws_cli
    check_aws_credentials
    
    case "${1:-help}" in
        "list")
            list_production_tables
            ;;
        "status")
            check_all_production_tables
            ;;
        "protect")
            protect_all_production_tables
            ;;
        "protect-table")
            if [ -z "$2" ]; then
                print_error "Table name is required for protect-table command"
                show_usage
                exit 1
            fi
            enable_deletion_protection "$2"
            ;;
        "unprotect-table")
            if [ -z "$2" ]; then
                print_error "Table name is required for unprotect-table command"
                show_usage
                exit 1
            fi
            print_warning "Are you sure you want to disable deletion protection on $2? (y/N)"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                disable_deletion_protection "$2"
            else
                print_status "Operation cancelled"
            fi
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function with all arguments
main "$@"
