#!/bin/bash

FILE="history.txt"
USER_FILTER=""

RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

#check if file exists or not
[ ! -f "$FILE" ] && touch "$FILE"

#user selection
function select_user() {
    read -p "Enter username: " USER_FILTER
    echo "Now filtering for user: $USER_FILTER"
}
#viewing recent games
function view_recent() {
    echo "---- Recent Games ----"

    #check if file is empty
    if [ ! -s "$FILE" ]; then
        echo "No data available"
        return
    fi

    if [ -z "$USER_FILTER" ]; then
        data=$(cat "$FILE")
    else
        data=$(grep "$USER_FILTER" "$FILE")
    fi
    
    (
            echo -e "---- Recent Games ----"
            echo -e "Use ↑ ↓ to scroll | Press 'q' to return"
            echo "----------------------"
            echo "$data" | awk -F'|' -v red="$RED" -v blue="$BLUE" -v nc="$NC" '
            {
                cause = $3
                if (cause ~ /WALL/) {
                    $3 = blue cause nc
                }
                else if (cause ~ /SELF/) {
                    $3 = red cause nc
                }
                print $1 "|" $2 "|" $3 "|" $4            
            }'
    
    ) | less -R
}

#viewing analytics
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
    wall_deaths=$(echo "$data" | grep -c "WALL")
    body_deaths=$(echo "$data" | grep -c "SELF")

    echo "Total games: $total"
    echo "Average score: %.2f\n" "$avg_score"
    echo "Average time: $avg_time"
    echo "Wall deaths: $wall_deaths"
    echo "Body deaths: $body_deaths"
}

#deleting entries
function delete_entries() {
    echo "1. Delete by username"
    echo "2. Delete by timestamp"
    echo "3. Delete invalid entries"
    read -p "Choice: " ch

    if [ "$ch" -eq 1 ]; then
        read -p "Enter username: " name
        read -p "Confirm delete? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            sed -i "/$name/d" "$FILE"
            echo "Deleted entries for $name"
        fi

    elif [ "$ch" -eq 2 ]; then
        read -p "Enter timestamp keyword: " ts
        read -p "Confirm delete? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            sed -i "/$ts/d" "$FILE"
            echo "Deleted entries matching timestamp"
        fi
    elif [ "$ch" -eq 3 ]; then
        read -p "Remove invalid entries? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            awk -F'|' 'NF==4 && $2 ~ /^[0-9]+$/ && $4 ~ /^[0-9]+$/' "$FILE" > temp.txt
            mv temp.txt "$FILE"
            echo "Invalid entires removed"
        fi

    else 
        echo "Invalid choice"
    fi
}

#rotating logs
function rotate_logs() {
    if [ ! -s "$FILE" ]; then
        echo "No data to rotate"
        return
    fi
    
    backup="backup_$(date +%s).txt.gz"

    gzip -c "$FILE" > "$backup"
    tail -n 10 "$FILE" > temp.txt
    mv temp.txt "$FILE"

    echo "Log rotated. Backup saved as $backup"
}

#sort file 
function sort_file() {
    echo "1. Sort by score"
    echo "2. Sort by username"
    echo "3. Sort by timestamp"

    read -p "Choice: " ch

    if [ "$ch" -eq 1 ]; then
        sort -t'|' -k2 -n "$FILE"

    elif [ "$ch" -eq 2 ]; then
        sort -t'|' -k1 "$FILE"

    elif [ "$ch" -eq 3 ]; then
        sort -t']' -k1 "$FILE"

    else
        echo "Invalid choice"
    fi
}

#filter
function filter_by_date() {
    read -p "Enter date (YYYY-MM-DD): " date
    grep "$date" "$FILE"
}

# MAIN MENU
while true; do
    echo ""
    echo "===== Snake Admin Menu ====="
    echo "1. Select User"
    echo "2. View Recent Games"
    echo "3. View Analytics"
    echo "4. Delete Entries"
    echo "5. Rotate Logs"
    echo "6. Sort File"
    echo "7. Filter by Date"
    echo "8. Exit"

    read -p "Enter choice: " choice

    if [ "$choice" -eq 1 ]; then
        select_user

    elif [ "$choice" -eq 2 ]; then
        view_recent

    elif [ "$choice" -eq 3 ]; then
        view_analytics

     elif [ "$choice" -eq 4 ]; then
        delete_entries

    elif [ "$choice" -eq 5 ]; then
        rotate_logs

    elif [ "$choice" -eq 6 ]; then
        sort_file

    elif [ "$choice" -eq 7 ]; then
        filter_by_date

    elif [ "$choice" -eq 8 ]; then
        exit 

    else 
        echo "Invalid choice"
    fi  
done
