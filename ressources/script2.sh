find . -type f -exec awk -v x=37 'NR==x{exit 1}' {} \; -exec rm -f {} \;