{*
* Copyright (C) 2017 Petr Hucik <petr@getdatakick.com>
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@getdatakick.com so we can send you a copy immediately.
*
* @author    Petr Hucik <petr@getdatakick.com>
* @copyright 2018 Petr Hucik
* @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*}
<div class="revws-grading">
  {assign "pad" $size/8}
  {section name="i" start=0 loop=5 step=1}
    <div style='padding-left:{$pad}px;padding-right:{$pad}px'>
      <svg
        class="revws-grade revws-grade-{if $grade <= $smarty.section.i.index}off{else}on{/if}"
        viewBox="{$shape.viewBox}"
        width="{$size}"
        height="{$size}"
        style="stroke-width:{$shape.strokeWidth}">
        <path d="{$shape.path}" />
      </svg>
    </div>
  {/section}
</div>