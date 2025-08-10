#!/usr/bin/env python3
"""
Pack per-frame PNG renders into a single spritesheet and JSON atlas for Phaser.

Usage:
  python scripts/packer.py --src renders/marine --out public/assets --cols 12 --tile 256

Expects frame files named like: action_dir_01.png (e.g., idle_e_01.png)
Outputs atlas image (marine.png) and JSON (marine.json) with frame rects keyed by filename.
"""
import argparse
import json
import math
import os
from glob import glob
from PIL import Image


def pack(src_dir: str, out_dir: str, cols: int, tile: int, name: str = 'marine', quantize: int | None = None, downscale: int | None = None):
    frames = sorted(glob(os.path.join(src_dir, '*.png')))
    if not frames:
        raise SystemExit(f'No PNG frames found in {src_dir}')

    os.makedirs(out_dir, exist_ok=True)

    # Load all frames and validate size
    imgs = [Image.open(p).convert('RGBA') for p in frames]
    w, h = imgs[0].size
    if tile:
        w = h = tile
        imgs = [img.resize((tile, tile), Image.NEAREST) for img in imgs]

    rows = math.ceil(len(imgs) / cols)
    sheet = Image.new('RGBA', (cols * w, rows * h), (0, 0, 0, 0))

    atlas = { 'frames': {}, 'meta': { 'app': 'custom-packer', 'size': { 'w': cols * w, 'h': rows * h } } }

    for idx, (img, path) in enumerate(zip(imgs, frames)):
        r, c = divmod(idx, cols)
        x, y = c * w, r * h
        sheet.paste(img, (x, y))
        key = os.path.splitext(os.path.basename(path))[0]  # e.g., idle_e_01
        atlas['frames'][key] = { 'frame': { 'x': x, 'y': y, 'w': w, 'h': h } }

    if quantize:
        sheet = sheet.quantize(colors=quantize, method=Image.MEDIANCUT).convert('RGBA')

    if downscale and downscale > 1:
        sheet = sheet.resize((sheet.width // downscale, sheet.height // downscale), Image.NEAREST)
        # Also scale frame rects in JSON
        for f in atlas['frames'].values():
            f['frame']['x'] //= downscale
            f['frame']['y'] //= downscale
            f['frame']['w'] //= downscale
            f['frame']['h'] //= downscale
        atlas['meta']['size']['w'] //= downscale
        atlas['meta']['size']['h'] //= downscale

    img_path = os.path.join(out_dir, f'{name}.png')
    json_path = os.path.join(out_dir, f'{name}.json')

    sheet.save(img_path)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(atlas, f)

    print(f'Wrote {img_path} and {json_path} ({len(frames)} frames)')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default='renders/marine')
    ap.add_argument('--out', default='public/assets')
    ap.add_argument('--cols', type=int, default=12)
    ap.add_argument('--tile', type=int, default=256)
    ap.add_argument('--name', default='marine')
    ap.add_argument('--quantize', type=int, default=0, help='Reduce colors (0=off)')
    ap.add_argument('--downscale', type=int, default=2, help='Downscale factor (1=no)')
    args = ap.parse_args()

    pack(
        src_dir=args.src,
        out_dir=args.out,
        cols=args.cols,
        tile=args.tile,
        name=args.name,
        quantize=(args.quantize or None),
        downscale=(args.downscale or None)
    )
