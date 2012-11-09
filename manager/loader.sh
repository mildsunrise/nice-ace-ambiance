#!/bin/bash
cd `dirname "$0"`

if [[ !(-e node_modules) ]]
then npm install || exit
fi

node index $*
