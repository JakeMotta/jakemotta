#!/bin/bash

dataPoints (){
for ((iter=1,i=1,j=2,k=3;iter<$((($1/2)+1)); ++iter,i+=3,j+=3,k+=3)); do
    (/home/student/Downloads/OpenFace/build/bin/FaceLandmarkImg -f "$3/$2.$i.png" -ofdir "$3/datapoints") & (/home/student/Downloads/OpenFace/build/bin/FaceLandmarkImg -f "$3/$2.$j.png" -ofdir "$3/datapoints") & (/home/student/Downloads/OpenFace/build/bin/FaceLandmarkImg -f "$3/$2.$k.png" -ofdir "$3/datapoints")
done
}

dataPoints
