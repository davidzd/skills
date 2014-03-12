Skills
======

This will be a clickable rpg-like skill/talent tree.

Inspired by [dungeons and developers](http://www.dungeonsanddevelopers.com)

## Basic Usage

Pretty easy. See index.html for example.

Each skill is a div with "skill" class:

    <div class="skill"></div>

You can add attributes to it - "current" and "max"

    <div class="skill boots" max="3" current="1"></div>

This will produce a skill that is clickable 3 times and already clicked once.

## Dependant skills

Also you can create skills that are depending on other ones. This can be done easily:

    <div class="skill" skillid="foo"></div>
    <div class="skill" musthave="foo"></div>

In this example there is a skill with id "foo" and the second one, which can be clicked only
if "foo" was clicked

## Advanced dependency

It is possible to make skill level dependant from several other skills levels.

    <div class="skill angel" skillid="quo" max="3" dependency="1:{foo:2,bar:3,baz:1}"></div>

In this example the skill can be upgraded to level 1 only if there is a skill "foo" with at least level 2,
"bar" with at least level 3 and "baz" with at least level 1.

The value is eval-ed, so be careful. Just in case. Also if the syntax is wrong - the object will end up with
no dependency (or with "musthave" one). Note that if there is an advanced dependency defined - the simple,
"musthave" one is ignored.

## Skill Description

To add a description - simply put another div inside skill item:

    <div class="skill boots">
        <div>
            <h3>Skill name/h3>
            <p>The skill will help you do awesome things!</p>
        </div>
    </div>

Additionally, each element in that div can have "showlevel" attribute - when it is set the
element will be shown only on certain level of skill

    <div class="skill boots">
        <div>
            <h3>Skill name/h3>
            <p showlevel="0">This will be visible only if the skill wasnt upgraded yet</p>
            <p showlevel="1">This will be visible if the skill was already upgraded</p>
        </div>
    </div>

Of course, you can add "max" to the skill and create hints for, say, level 2 or 3 et cetera.

Also note that if you are going to show multiple elements of text on certain level - it is recommended to wrap them
with span. For example:

    <div class="skill">
        <div>
            <h3>jQuery</h3>
            <p>jQuery is a JS library</p>

            <span showlevel=0">
                <p><i>In order to advance with this you must:</i></p>
                <p>Learn JavaScript</p>
                <p>Get an IDE</p>
                <p>Get jQuery</p>
            </span>
        </div>
    </div>

This way you can hint users which skills are required for advancement in something.

## Layout generator

Layout generator is used to define trees with JS only. The description will be here later. Until then -
see the bottom of skill_layout.js for example.

## Hacking notes

 - The stylesheet is generated from LESS file. If you are going to modify the css - consider using
[LESS preprocessor](http://lesscss.org) Otherwise it will be a mess. If you are unfamiliar with LESS - please, call
the seniors. To select sprite from sprite picture - set its coordinates in .bg mixin (see style.less for examples)

## Plans for future

 - Level decreasing
 - Avatars and primary skills
 - Saving and restoring data
 - Non-interactable objects : skill-depending objects like arrows and stuff (medals?), auto-updating non-clickable skills
 - Different sprites for different levels.