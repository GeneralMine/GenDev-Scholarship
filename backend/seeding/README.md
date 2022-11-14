# Seeding

## Create subset of database
Using powershell:

1. Get first 1000 lines and store in file`Get-Content -First 1000 .\offers.csv > offers1k.csv`
2. remove " `(Get-Content offers1k.csv).replace('"', '') | Set-Content offers1k.csv`