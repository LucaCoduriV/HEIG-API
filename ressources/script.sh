#!/bin/bash

for i in {0..300}
do
    curl "https://username:password.ever@gaps.heig-vd.ch/consultation/horaires/?annee=2022&trimestre=1&type=4&id=$i&icalendarversion=2&individual=1" --output ./icals/$i.ical
done


