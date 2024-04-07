BASICODE interpreter
====================

This is a BASICODE interpreter in Javascript, compatible with BASICODE versions 2, 3 and 3C.
It's free & open source, released under the Expat MIT licence.
There is `a live demo <http://robhagemans.github.io/basicode/>`_
and `a collection of programs <https://github.com/robhagemans/basicode>`_.

`BASICODE <https://github.com/robhagemans/basicode>`_ was a 1980s-era cross-platform BASIC standard designed to allow software transmission by radio.

.. image:: https://robhagemans.github.io/basicode/basicode-arabesque.png

*Screenshot taken from* `Arabesque <https://github.com/robhagemans/basicode/blob/master/Verzamelcassette_2/B01_Arabesque.bc3>`_,
*a 1987 BASICODE-3 program by Ch. W. Brederode.*

Quick start
-----------
::

    <!DOCTYPE html>
    <html>
    <head>
        <script src="basicode.js"></script>
    </head>
    <body>
        <script type="text/basicode">
            1010 PRINT "Hello, world!"
        </script>
    </body>
    </html>


Deployment
----------

The package consists of a single Javascript file. To embed one or more interpreters in an HTML5 document, link the script in the header.
It will scan the HTML for any ``<script type="text/basicode">`` elements , replace them with newly created canvases and execute the BASICODE
in the script content or ``src=`` text file. Enjoy!


Settings
--------

A number of options can be set through the dataset attribute of the ``script`` element:

===================== =======================================================================
Attribute             Setting
===================== =======================================================================
``data-columns``      Number of text columns
``data-rows``         Number of text rows
``data-speed``        Number of cycles per second in ``FOR`` loops (roughly)
``data-font``         Font to use for text (see below)
``data-color-0``      Set the colour value for black (background)
``data-color-1``      Set the colour value for blue
``data-color-2``      Set the colour value for red
``data-color-3``      Set the colour value for magenta
``data-color-4``      Set the colour value for green
``data-color-5``      Set the colour value for cyan
``data-color-6``      Set the colour value for yellow
``data-color-7``      Set the colour value for white (foreground)
===================== =======================================================================


Fonts
-----

The following fonts are available:

============== ===== ======================================
Font           Size  Description
============== ===== ======================================
``smooth``           Browser's native monospace font
``tiny``       6x4   A very small bitmap font
``apple``      7x8   Apple-II font
``msx``        7x8   MSX font
``atari``      8x8   Atari 8-bit font
``bbc``        8x8   Acorn BBC Micro font
``c64``        8x8   Commodore 64 font
``cpc``        8x8   Amstrad/Schneider CPC font
``exidy``      8x8   Exidy Sorcerer font
``genie1``     8x8   EACA Colour Genie 1st font
``genie2``     8x8   EACA Colour Genie 2nd font
``kc85``       8x8   Robotron KC85/1 font
``pcw``        8x8   Amstrad PCW/Schneider JOYCE font
``spectrum``   8x8   Sinclair ZX Spectrum font
``vic``        8x8   Commodore PET and VIC-20 font
``cga``        8x8   IBM CGA font
``thin``       8x8   IBM CGA thin stroke font
``pcjr``       8x8   IBM PCjr font
``tandy``      8x8   Tandy 1000 font
``tandy2``     8x8   Tandy 1000 font, later version
``p2000``      8x10  Philips P2000T font
``coco``       8x12  Tandy TRS-80 CoCo v1&2 font
``coco3``      8x12  Tandy TRS-80 CoCo v3 font
``mpf``        8x12  Multitech Micro-Professor MPF-I font
``ega``        8x14  IBM EGA font
``mda``        9x14  Hercules and IBM MDPA font
``olivetti``   8x16  Olivetti M24 and AT&T 6300 font
``vga``        9x16  IBM VGA font
``wyse-serif`` 16x16 Wyse WY-700 serif font
``wyse-sans``  16x16 Wyse WY-700 sans serif font
============== ===== ======================================


Compatibility
-------------

The interpreter should work on reasonably recent, standards-compliant browsers.
You need a keyboard, so it will be difficult to use on mobile.
I've superficially tested it on Chrome, Firefox, Safari, and Opera.
It probably works fine on Edge, but I haven't tried. It mostly works on Internet Explorer 11 (except sound) but not at all on older versions.


Acknowledgements
----------------

There's a similar, earlier implementation of `BASICODE in JavaScript by Steven Goodwin <https://github.com/MarquisdeGeek/basicode>`_.
His implementation and mine are completely independent; however, he got there first.

The bitmap fonts were drawn based on various sources:

- Damien Guard's `overview of system fonts in 8- and 16-bit systems <https://damieng.com/blog/2011/02/20/typography-in-8-bits-system-fonts>`_
- John Elliott's `Vintage PC Pages <http://www.seasip.info/VintagePC/>`_
- Exidy Sorcerer page on `The Trailing Edge <http://www.trailingedge.com/exidy/>`_
- Z9001 page on `Homecomputer DDR <http://hc-ddr.hucki.net/wiki/doku.php/z9001:versionen>`_
- Ulrich Zander's `character sets for the KC85 <http://www.sax.de/~zander/z9001/ex/zsatz.html>`_


BASICODE support for original and retro platforms
-------------------------------------------------

Originally, BASICODE tape reader and conversion programs were sold by broadcasters and publishers. Many of these are still available on retrogaming archives. A few can also be found on `BASICODE-Software für alle <https://www.joyce.de/basicode/>`_.

A few authors have published their own source code for conversion programs. I'm aware of:

- `BASICODE-3 for ZX Spectrum, by Jan Bredenbeek <https://github.com/janbredenbeek/ZXSpectrum-Basicode>`_
- `BASICODE-3 v2 for Sinclair QL, by Jan Bredenbeek <https://github.com/janbredenbeek/QL-Basicode>`_
- `BASICODE-2 for C64 and Commander x16, by Iljitsch van Beijnum <https://www.iljitsch.com/2020/beeldkrant250/basicode2.c64.txt>`_
- `BASICODE-3 for MS-DOS, by Jac Goudsmit <https://github.com/jacgoudsmit/Basicode>`_
- `BASICODE-3 for KC85/3-5, by M. Leubner <https://github.com/maleuma/BASICODE>`_


Other BASICODE interpreters for modern platforms
------------------------------------------------

- `BASICODE in JavaScript, by Steven Goodwin <https://github.com/MarquisdeGeek/basicode>`_
- `BASICODE in Java, by Michael Haupt <https://github.com/mhaupt/basicode>`_
