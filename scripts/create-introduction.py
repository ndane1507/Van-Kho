"""Render the 30-second Văn Khố film (no subtitles).

Dependencies: Pillow, numpy, imageio-ffmpeg, edge-tts >= 7.3.1.
The generated photography and licensed fonts are stored in the project.
Network access is needed only for Vietnamese narration synthesis.
"""
import asyncio
from pathlib import Path
import re
import subprocess
import tempfile
import wave

import edge_tts
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/videos'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FPS = 25
LENGTH = 6.48
OVERLAP = 0.6
SCENES = [
    ('van-kho-film-scene.jpg', 'MỘT KHÔNG GIAN DÀNH CHO NGƯỜI YÊU VĂN',
     ['Văn Khố'], 'Kho tàng văn học trong tầm tay',
     'Văn Khố. Mở một trang sách, mở một thế giới.'),
    ('van-kho-reading-room.webp', 'TỪ HAI NGƯỜI YÊU VĂN',
     ['Nguyễn Văn Đạt', 'Nguyễn Đức Anh'], 'Ý tưởng và thực hiện',
     'Từ ý tưởng của Nguyễn Văn Đạt và Nguyễn Đức Anh.'),
    ('mua-xuan-chin.webp', 'NHỮNG CUỘC GẶP TRONG TRANG SÁCH',
     ['Một tác phẩm.', 'Nhiều cách cảm.'], 'Văn học lớp 10, 11, 12',
     'Nơi gặp gỡ tác phẩm, tác giả và những cảm nhận riêng.'),
    ('trang-giang.webp', 'ĐỂ VĂN HỌC ĐẾN GẦN HƠN',
     ['Đọc sâu.', 'Hiểu thật kỹ.'], 'Và tìm thấy cảm nhận của riêng mình',
     'Để mỗi học sinh được đọc sâu, hiểu kỹ, và thêm yêu văn học.'),
    ('van-kho-film-scene.jpg', 'KẾT NỐI QUÁ KHỨ, TRUYỀN CẢM HỨNG CHO HIỆN TẠI',
     ['Mở một trang.', 'Chạm một thế giới.'], 'van-kho.vercel.app',
     'Kết nối quá khứ. Truyền cảm hứng cho hiện tại. Văn Khố.'),
]


def run(args):
    result = subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.decode('utf-8', errors='replace'))


def type_layer(path, label, lines, footer, index):
    """Independent film typography layer; these are title cards, not captions."""
    layer = Image.new('RGBA', (1280, 720))
    draw = ImageDraw.Draw(layer)
    serif = ROOT / 'docs/media/fonts/Newsreader.ttf'
    sans = ROOT / 'docs/media/fonts/BeVietnamPro-Regular.ttf'
    font = lambda size: ImageFont.truetype(str(serif), size)
    small = lambda size: ImageFont.truetype(str(sans), size)
    draw.text((85, 105), label, font=small(17), fill='#e8dcc1')
    draw.line((85, 153, 140, 153), fill='#d7b986', width=2)
    size = 146 if index == 0 else 85 if index == 1 else 91
    while max(draw.textbbox((0, 0), line, font=font(size))[2] for line in lines) > 1035:
        size -= 1
    top = 224 if index == 0 else 228
    for row, line in enumerate(lines):
        draw.text((80, top + row * (size + 19)), line, font=font(size), fill='#fff7e6', stroke_width=0)
    draw.text((85, 468 if index == 0 else 508), footer, font=small(23), fill='#e7dcc6')
    draw.text((85, 637), 'VĂN KHỐ', font=small(15), fill='#d7c9ad')
    layer.save(path)


def gradient(path):
    # A transparent lighting layer for the video leaves the photography visible.
    width, height = 1280, 720
    rgba = np.zeros((height, width, 4), dtype=np.uint8)
    rgba[:, :, :3] = (12, 22, 17)
    alpha = np.linspace(0.83, 0.04, width) ** 0.8
    rgba[:, :, 3] = (255 * alpha).astype(np.uint8)[None, :]
    Image.fromarray(rgba).save(path)


def music(path):
    """Original restrained instrumental bed, synthesized locally."""
    sample_rate = 48000
    output = np.zeros(30 * sample_rate, dtype=np.float64)
    chords = [[146.832, 174.614, 220, 261.626], [116.541, 146.832, 174.614, 220],
              [130.813, 174.614, 220, 261.626], [130.813, 164.814, 195.998, 293.665]]
    for i in range(20):
        start = i * 1.43
        frequency = chords[min(i // 5, 3)][i % 4] * (2 if i % 3 else 1)
        duration = min(5, 30 - start)
        t = np.arange(int(duration * sample_rate)) / sample_rate
        envelope = (1 - np.exp(-t * 20)) * np.exp(-t * 1.25)
        tone = sum(np.sin(2 * np.pi * frequency * partial * t) * np.exp(-t * partial * .3) / partial ** 2
                   for partial in range(1, 5))
        signal = tone * envelope * .017
        offset = int(start * sample_rate)
        output[offset:offset + len(signal)] += signal
    time = np.arange(len(output)) / sample_rate
    output *= np.minimum(time / 2, 1) * np.clip((30 - time) / 2, 0, 1)
    stereo = np.column_stack((output, output * .93))
    with wave.open(str(path), 'wb') as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(sample_rate)
        file.writeframes((np.clip(stereo, -1, 1) * 32767).astype('<i2').tobytes())


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='van-kho-film-') as folder:
        tmp = Path(folder)
        shade = tmp / 'lighting.png'
        gradient(shade)
        for index, (image, label, lines, footer, speech) in enumerate(SCENES):
            narration = tmp / f'voice-{index}.mp3'
            await edge_tts.Communicate(speech, 'vi-VN-HoaiMyNeural', rate='-2%').save(str(narration))
            probe = subprocess.run([FFMPEG, '-i', str(narration)], capture_output=True, text=True)
            match = re.search(r'Duration: (\d+):(\d+):([\d.]+)', probe.stderr)
            if not match:
                raise RuntimeError('Could not determine narration duration')
            duration = int(match[1])*3600 + int(match[2])*60 + float(match[3])
            tempo = max(1, duration/5.35)
            voice = tmp / f'voice-{index}.wav'
            run(['-i', narration, '-af', f'atempo={tempo:.5f},loudnorm=I=-18:TP=-2:LRA=9,afade=t=out:st=5.2:d=0.15', '-ar', '48000', '-ac', '2', voice])
            typography = tmp / f'type-{index}.png'
            type_layer(typography, label, lines, footer, index)
            background = ROOT / 'public/images' / image
            # All shots share timebase, frame count, pixel format and colour range.
            # This prevents reinitialization or timestamp jumps at a transition.
            graph = (
                "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
                "zoompan=z='1.015+0.045*on/162':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1280x720:fps=25,setsar=1[photo];"
                "[photo][1:v]overlay=0:0[lit];"
                "[2:v]format=rgba,fade=t=in:st=0.25:d=0.8:alpha=1[type];"
                "[lit][type]overlay=x=0:y='10*max(0,1-t)':eval=frame,scale=out_range=tv,format=yuv420p[v]"
            )
            run(['-loop', '1', '-framerate', str(FPS), '-i', background,
                 '-loop', '1', '-framerate', str(FPS), '-i', shade,
                 '-loop', '1', '-framerate', str(FPS), '-i', typography,
                 '-filter_complex', graph, '-map', '[v]', '-an', '-t', str(LENGTH),
                 '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
                 '-color_range', 'tv', tmp / f'scene-{index}.mp4'])
            print(f'Rendered cinematic shot {index+1}/5', flush=True)
        music(tmp / 'music.wav')
        args = []
        for i in range(5):
            args.extend(['-i', tmp / f'scene-{i}.mp4'])
        for i in range(5):
            args.extend(['-i', tmp / f'voice-{i}.wav'])
        args.extend(['-i', tmp / 'music.wav'])
        filters = []
        previous = '0:v'
        for i in range(1, 5):
            start = i * (LENGTH - OVERLAP)
            filters.append(f'[{previous}][{i}:v]xfade=transition=fade:duration={OVERLAP}:offset={start:.2f}[v{i}]')
            previous = f'v{i}'
        filters.append(f'[{previous}]fade=t=in:d=0.45,fade=t=out:st=29.25:d=0.75,format=yuv420p[v]')
        for i in range(5):
            delay = round((i * (LENGTH - OVERLAP) + .45) * 1000)
            filters.append(f'[{5+i}:a]adelay={delay}:all=1[a{i}]')
        filters.append('[a0][a1][a2][a3][a4][10:a]amix=inputs=6:normalize=0,apad,atrim=duration=30,alimiter=limit=0.95,afade=t=out:st=28.8:d=1.2[a]')
        output = OUT / 'van-kho-introduction-v2.mp4'
        run([*args, '-filter_complex', ';'.join(filters), '-map', '[v]', '-map', '[a]',
             '-t', '30', '-r', str(FPS), '-c:v', 'libx264', '-preset', 'fast', '-crf', '21',
             '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000',
             '-movflags', '+faststart', output])
        run(['-ss', '2.2', '-i', output, '-frames:v', '1', '-q:v', '2', ROOT / 'public/images/van-kho-film-poster.jpg'])
        print(output)


if __name__ == '__main__':
    asyncio.run(main())
