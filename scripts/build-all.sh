set -e;
set -x;
bash ./scripts/clean.sh;
mkdir -p ./dashboard ./extension ./graphics;
npx parcel build --target soundalerts           \
                 --target "dashboard-settings"  \
                 --target "dashboard-playcount" \
                 --target extension             \
;