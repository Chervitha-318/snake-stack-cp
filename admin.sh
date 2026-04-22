#!/bin/bash

FILE="history.txt"
USER_FILTER=""

touch "$FILE"

function select_user() {
    read -p "Enter username: " USER_FILTER
    echo "Filtering for: $USER_FILTER"
}

function view_recent() {
    echo "---- Recent Games ----"

    if [ -z "$USER_FILTER" ]; then
        tail -n 10 "$FILE"
    else
        grep "$USER_FILTER" "$FILE" | tail -n 10
    fi
}

function view_analytics() {
    echo "---- Analytics ----"

    if [ -z "$USER_FILTER" ]; then
        data=$(cat "$FILE")
    else
        data=$(grep "$USER_FILTER" "$FILE")
    fi

    total=$(echo "$data" | wc -l)

    if [ "$total" -eq 0 ]; then
        echo "No data available"
        return
    fi

    avg_score=$(echo "$data" | awk -F'|' '{sum+=$2} END {print sum/NR}')
    avg_time=$(echo "$data" | awk -F'|' '{sum+=$4} END {print sum/NR}')
    wall_deaths=$(echo "$data" | grep -c "wall")
    body_deaths=$(echo "$data" | grep -c "body")

    echo "Total games: $total"
    echo "Average score: $avg_score"
    echo "Average time: $avg_time"
    echo "Wall deaths: $wall"
    echo "Body deaths: $body"
}

function delete_entries() {
    echo "1. Delete by username"
    echo "2. Delete by timestamp"
    read -p "Choice: " ch

    if [ "$ch" -eq 1 ]; then
        read -p "Enter username: " name
        sed -i "/$name/d" "$FILE"
        echo "Deleted entries for $name"
    elif [ "$ch" -eq 2 ]; then
        read -p "Enter timestamp keyword: " ts
        sed -i "/$ts/d" "$FILE"
        echo "Deleted entries by timestamp"
    fi
}

function rotate_logs() {
    backup="backup_$(date +%s).txt"
    cp "$FILE" "$backup"
    tail -n 10 "$FILE" > temp.txt
    mv temp.txt "$FILE"
    echo "Log rotated. Backup saved as $backup"
}

function sort_file() {
    echo "1. Sort by score"
    echo "2. Sort by username"
    read -p "Choice: " ch

    if [ "$ch" -eq 1 ]; then
        sort -t'|' -k2 -n "$FILE"
    elif [ "$ch" -eq 2 ]; then
        sort -t'|' -k1 "$FILE"
    fi
}

# MENU
while true; do
    echo ""
    echo "===== Snake Admin ====="
    echo "1. Select User"
    echo "2. View Recent Games"
    echo "3. View Analytics"
    echo "4. Delete Entries"
    echo "5. Rotate Logs"
    echo "6. Sort File"
    echo "7. Exit"

    read -p "Enter choice: " choice

    case $choice in
        1) select_user ;;
        2) view_recent ;;
        3) view_analytics ;;
        4) delete_entries ;;
        5) rotate_logs ;;
        6) sort_file ;;
        7) exit ;;
        *) echo "Invalid option" ;;
    esac
done
