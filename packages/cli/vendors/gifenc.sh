#!/bin/bash

#*********************************************
#                gifenc.sh                   *
#                                            *
# developer: SCG82 (scg082+gifenc@gmail.com) *
#*********************************************

USAGE="Usage: $0 -w [output width] -n [select every nth frame] -d [dither algorithm: floyd_steinberg, sierra2, sierra2_4a, none] -s [start time hh:mm:ss] -e [end time hh:mm:ss] FILE"
VERSION=1.0

# if filename not supplied display usage message and die
[ $# -eq 0 ] && { echo $USAGE; exit 1; }

_file=""
hsize=-1
fps=30
n=1
dither="floyd_steinberg"
start="00:00:00"
endtime=""
has_start=0
has_end=0
full=1

while getopts ":w:n:d:s:e:vh" optname
	do
		case "$optname" in
			"v")
				echo "Version $VERSION"
				exit 0;
			;;
			"w")
				if [[ "$OPTARG" =~ ^[0-9]+$ ]] && [ "$OPTARG" -ge 1 ]; then
					# echo "width: $OPTARG pixels"
					hsize=$OPTARG
				else
					echo "invalid width \"$OPTARG\"" && exit 1
				fi
			;;
			"n")
				if [[ "$OPTARG" =~ ^[0-9]+$ ]] && [ "$OPTARG" -ge 1 ]; then
					# echo "select 1 of every $OPTARG frames"
					n=$OPTARG
				else
					echo "invalid entry \"$OPTARG\"" && exit 1
				fi
			;;
			"d")
				if [[ "$OPTARG" =~ ^[a-zA-Z0-9_]+$ ]]; then
					echo "dither algorithm: $OPTARG"
					dither=$OPTARG
				else
					echo "invalid dither \"$OPTARG\"" && exit 1
				fi
			;;
			"s")
				if [[ "$OPTARG" =~ ^[0-9:.]+$ ]]; then
					echo "start time: $OPTARG"
					start=$OPTARG
					has_start=1
				else
					echo "invalid start time \"$OPTARG\"" && exit 1
				fi
			;;
			"e")
				if [[ "$OPTARG" =~ ^[0-9:.]+$ ]]; then
					echo "end time: $OPTARG"
					endtime=$OPTARG
					has_end=1
				else
					echo "invalid end time \"$OPTARG\"" && exit 1
				fi
			;;
			"h")
				echo $USAGE
				exit 0;
			;;
			"?")
				echo "Unknown option $OPTARG"
				exit -1;
			;;
			":")
				echo "No argument value for option $OPTARG"
				exit -1;
			;;
			*)
				echo "Unknown error while processing options"
				exit -1;
			;;
		esac
	done

shift $(($OPTIND - 1))

_file=$1

# if file not found, display an error and die
[ ! -f "$_file" ] && { echo "$0: $_file not found."; exit 2; }

file_inc_ext=$(basename $_file)
file_no_ext="${file_inc_ext%.*}"
in_dir=$(echo $(cd $(dirname "$1") && pwd -P))

fps=$(ffmpeg -i "$_file" 2>&1 | sed -n "s/.*, \([^k]*\) tbr.*/\1/p")

out_fps=$(echo "scale=4; $fps / $n" | bc)

in_width=$(ffprobe -v error -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 -select_streams v:0 "$_file")
in_height=$(ffprobe -v error -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 -select_streams v:0 "$_file")

in_sar_raw=$(ffprobe -v error -show_entries stream=sample_aspect_ratio -of default=noprint_wrappers=1:nokey=1 -select_streams v:0 "$_file")

in_sar_num=${in_sar_raw%%:*}
in_sar_den=${in_sar_raw##*:}

if [ $in_sar_num -eq 0 ] || [ $in_sar_den -eq 0 ]; then
	in_sar=1
	in_sar_num=1
	in_sar_den=1
else
	in_sar=$(echo "scale=4; $in_sar_num / $in_sar_den" | bc)
fi

out_width=$hsize
out_height_calc="($out_width*$in_height*$in_sar_den)/($in_width*$in_sar_num)"
out_height_bc=$(echo "scale=2; ($out_height_calc+0.5)/1" | bc)
out_height=$(echo "scale=0; $out_height_bc/1" | bc)

echo "input size: $in_width x $in_height"
echo "output size: $out_width x $out_height"
echo "in  fps: $fps"
echo "out fps: $out_fps"
echo "select 1 of every $n frames"

TEMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'gifenc'`

palette="${TEMPDIR}/palette.png"

trap 'rm -rf "$TEMPDIR" >/dev/null 2>&1' 0
trap "exit 2" 1 2 3 13 15

#filters="fps=${fps},scale=${hsize}:-1:flags=lanczos"
#filters="select=not(mod(n\,${n})),fps=${out_fps},scale=${hsize}:-1:flags=lanczos"
filters="select=not(mod(n\,${n})),fps=${out_fps},scale=${hsize}:-1:flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp+bitexact"
sws_flags="lanczos+accurate_rnd+full_chroma_int+full_chroma_inp+bitexact"

if [ $has_end -eq 1 ]; then
	ffmpeg -v warning -i "$_file" -vf "$filters,palettegen" -sws_flags $sws_flags -ss $start -to $endtime -y $palette
	ffmpeg -v warning -i "$_file" -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse=dither=$dither" -sws_flags $sws_flags -ss $start -to $endtime -y "${in_dir}"/"${file_no_ext}".gif
elif [ $has_start -eq 1 ]; then
	ffmpeg -v warning -i "$_file" -vf "$filters,palettegen" -sws_flags $sws_flags -ss $start -y $palette
	ffmpeg -v warning -i "$_file" -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse=dither=$dither" -sws_flags $sws_flags -ss $start -y "${in_dir}"/"${file_no_ext}".gif
else
	ffmpeg -v warning -i "$_file" -vf "$filters,palettegen" -sws_flags $sws_flags -y $palette
	ffmpeg -v warning -i "$_file" -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse=dither=$dither" -sws_flags $sws_flags -y "${in_dir}"/"${file_no_ext}".gif
fi

exit