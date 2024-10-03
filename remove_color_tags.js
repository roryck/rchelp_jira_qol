// ==UserScript==
// @name         Remove Color Tags
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes annoying color tags from all text rendered in the RC-HELP Jira, now including dynamic content
// @author       Rory + CGPT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove color tags from a given text content
    function removeColorTags(content) {
        // Regular expression to match color tags in the format {color:#XXXXXX}, {color:#XXX}, or {color}
        const colorTagRegex = /\{color(?::#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3}))?\}/g;
        return content.replace(colorTagRegex, ''); // Remove color tags
    }

    // Function to recursively process child nodes
    function processChildNodes(node) {
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === Node.TEXT_NODE) {
                child.nodeValue = removeColorTags(child.nodeValue); // Remove color tags from text nodes
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                processChildNodes(child); // Recursively process child nodes
            }
        }
    }

    // Main function to remove color tags from the entire page
    function removeColorTagsFromPage() {
        processChildNodes(document.body); // Process child nodes recursively starting from body
    }

    // Run the main function to remove color tags from the existing content
    removeColorTagsFromPage();

    // MutationObserver to watch for DOM changes and remove color tags from new content
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        processChildNodes(node); // Process new nodes added to the DOM
                    }
                });
            }
        }
    });

    // Start observing the document body for child node changes and subtree changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
