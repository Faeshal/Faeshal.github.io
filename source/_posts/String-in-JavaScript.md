---
title: String in JavaScript
date: 2019-03-09 12:36:26
tags:
  - string
categories:
  - javascript
---

##### ![](https://faeshal.com/storage/posts/March2019/strin head1.jpg)

##### String Object in Javascript

This is first Javascript series which talk about object in javascript.In This Section We will jump to the String in JavaScript.In JavaScript, objects are king. If you understand objects, you understand JavaScript.So let's back to the string.

##### What is String ?

The JavaScript string is an object that represents a sequence of characters.There are 2 ways to create string in JavaScript.

###### 1.By String Literal

The string literal is created using double quotes. The syntax of creating string using string literal is given below:

    var stringname="Hello,this is inside string";

###### 2.By String Object

The syntax of creating string object using new keyword is given below:

    var stringname=new String("Hello,this is using another style");

Remember,inside parentheses is the output/content of the string,and dont forget to give a name of the string.So next let's jump to Javascript string methods.

##### Javascript String Methods

Methods are actions that can be performed on objects. A Javascript method is a property containing function definition. Here is a list of the methods available in String object along with their description.

| Methods             | Description                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| charAt()            | It provides the char value present at the specified index                                                             |
| charCodeAt()        | It provides the Unicode value of a character present at the specified index.                                          |
| concat()            | It provides a combination of two or more strings.                                                                     |
| indexOf()           | It provides the position of a char value present in the given string.                                                 |
| lastIndexOf()       | It provides the position of a char value present in the given string by searching a character from the last position. |
| search()            | It searches a specified regular expression in a given string and returns its position if a match occurs.              |
| match()             | It searches a specified regular expression in a given string and returns that regular expression if a match occurs.   |
| replace()           | It replaces a given string with the specified replacement.                                                            |
| substr()            | It is used to fetch the part of the given string on the basis of the specified starting position and length.          |
| substring()         | It is used to fetch the part of the given string on the basis of the specified index.                                 |
| slice()             | It is used to fetch the part of the given string. It allows us to assign positive as well negative index.             |
| toLowerCase()       | It converts the given string into lowercase letter.                                                                   |
| toLocaleLowerCase() | It converts the given string into lowercase letter on the basis of host?s current locale.                             |
| toUpperCase()       | It converts the given string into uppercase letter.                                                                   |
| toLocaleUpperCase() | It converts the given string into uppercase letter on the basis of host?s current locale.                             |
| toString()          | It provides a string representing the particular object.                                                              |
| valueOf()           | It provides the primitive value of string object.                                                                     |
| trim()              | It will removes leading and trailing whitespaces from the string.                                                     |

##### How to use it ?

Very simple to use string method just add the method after the object do you want to modify , but i will give you 2 example using toUpperCase() & trim()

###### toupperCase()

    var s1="javascript touppercase example";
    var s2=s1.toUpperCase();
    document.write(s2);

This is the Output :

    JAVASCRIPT TOUPPERCASE EXAMPLE

###### trim()

    var s1="     javascript trim    ";
    var s2=s1.trim();
    document.write(s2);

This is the Output :

    javascript trim

##### Last Word

So,that's it about string in Javascript, Dont forget to check documentation for more detail,Link down below.

- **[Javascript String Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**
