/*
 * Copyright (C) 2019-2022  Yomichan Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* global
 * Frontend
 * HotkeyHandler
 * PopupFactory
 * EXTENSION_COMMANDS
 * PITCH_COLOR
 * KANJI_VIEW_URL
 * KANJI_VIEW_TYPE
 * KANJI_VIEW_SETTINGS
 * performMigakuParse
 * changeFuriganaVisibility
 */

(async () => {
    try {
        await yomichan.prepare();

        const {tabId, frameId} = await yomichan.api.frameInformationGet();
        if (typeof frameId !== 'number') {
            throw new Error('Failed to get frameId');
        }

        const isTopLevel = window === window.parent;

        if (isTopLevel) {
            chrome.runtime.onMessage.addListener((message) => {
                if (message.cmd === EXTENSION_COMMANDS.PITCH_COLOR) {
                    performMigakuParse();
                }
            });

            const hotkeyHandler = new HotkeyHandler();
            hotkeyHandler.prepare();

            const popupFactory = new PopupFactory(frameId);
            popupFactory.prepare();

            const frontend = new Frontend({
                tabId,
                frameId,
                popupFactory,
                depth: 0,
                parentPopupId: null,
                parentFrameId: null,
                useProxyPopup: false,
                pageType: 'web',
                allowRootFramePopupProxy: true,
                hotkeyHandler
            });
            await frontend.prepare();
        }

        const scrollToSelector = (selector) => {
            const element = document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                window.scrollTo(0, rect.top);
            }
        };

        chrome.runtime.onMessage.addListener((message) => {
            if (message.cmd === EXTENSION_COMMANDS.TOGGLE_FURIGANA) {
                changeFuriganaVisibility(message.visible);
            }
        });

        const migakuParse = () => {
            chrome.storage.local.get(KANJI_VIEW_SETTINGS.AUTO_PITCH_COLOR, async (storage) => {
                const doPitchColor = !!storage[KANJI_VIEW_SETTINGS.AUTO_PITCH_COLOR];
                if (doPitchColor) {
                    performMigakuParse();
                } else {
                    chrome.runtime.onMessage.addListener((message) => {
                        if (message.cmd === EXTENSION_COMMANDS.PITCH_COLOR) {
                            performMigakuParse();
                        }
                    });
                }
            });
        };

        if (window.location.host === new URL(KANJI_VIEW_URL[KANJI_VIEW_TYPE.JPDB]).host) {
            const onLoad = () => {
                const containers = Array.from(document.querySelectorAll('.results .vbox.gap ruby'));
                const words = containers.map((container) => {
                    return Array.from(container.childNodes).filter((child) => {
                        return child.nodeType === Node.TEXT_NODE;
                    }).map((child) => child.textContent).join('');
                });

                chrome.runtime.sendMessage({
                    cmd: EXTENSION_COMMANDS.QUERY_YOMICHAN,
                    words
                }, (response = []) => {
                    for (let i = 0; i < response.length; i++) {
                        const container = containers[i];
                        const color = response[i];
                        const newChildren = Array.from(container.childNodes).map((child) => {
                            if (child.nodeType === Node.TEXT_NODE && color) {
                                const wrapper = document.createElement('p');
                                wrapper.innerText = child.textContent;
                                wrapper.style.setProperty('margin', '0');
                                wrapper.style.setProperty('color', PITCH_COLOR[color.toUpperCase()]);

                                return wrapper;
                            } else {
                                return child.cloneNode(true);
                            }
                        });

                        container.innerHTML = '';

                        for (const child of newChildren) {
                            container.appendChild(child);
                        }
                    }

                    return true;
                });

                // Jump to first Result, if inside an iframe
                if (window !== window.parent) {
                    if (window.location.pathname.startsWith('/kanji')) {
                        scrollToSelector('.kanji-reading-list-common');
                    } else {
                        scrollToSelector('.results');
                    }
                }
                migakuParse();
            };

            if (document.readyState !== 'loading') {
                onLoad();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    onLoad();
                });
            }
        }

        if (window.location.host === new URL(KANJI_VIEW_URL[KANJI_VIEW_TYPE.KANSHUDO]).host) {
            // Jump to first Result, if inside an iframe
            if (window !== window.parent) {
                const onLoad = () => {
                    const header = document.querySelector('#main-header');
                    const firstResult = document.querySelector('.searchresults .kanjirow');

                    if (firstResult) {
                        if (header) {
                            header.remove();
                        }
                        scrollToSelector('.searchresults .kanjirow');
                    }

                    // migakuParse();
                };

                if (document.readyState !== 'loading') {
                    onLoad();
                } else {
                    window.addEventListener('DOMContentLoaded', () => {
                        onLoad();
                    });
                }
            }
        }

        if (window.location.host === new URL(KANJI_VIEW_URL[KANJI_VIEW_TYPE.OJAD]).host) {
            const searchParams = new URLSearchParams(location.search);

            const onLoad = () => {
                if (searchParams.has('text')) {
                    document.body.style.display = 'none';
                    const defaultData = {
                        text: '',
                        curve: 'advanced',
                        accent: 'advanced',
                        accent_mark: 'all',
                        estimation: 'bunsetsu',
                        analyze: 'true',
                        phrase_component: 'invisible',
                        param: 'invisible',
                        subscript: 'visible',
                        jeita: 'invisible'
                    };

                    const payload = {
                        _method: 'POST'
                    };

                    for (const [key, defaultValue] of Object.entries(defaultData)) {
                        payload[`data[Phrasing][${key}]`] = searchParams.has(key) ? searchParams.get(key).toString() : defaultValue;
                    }

                    const form = document.createElement('form');
                    form.method = 'post';
                    form.action = KANJI_VIEW_URL[KANJI_VIEW_TYPE.OJAD];
                    form.style.display = 'none';

                    for (const key in payload) {
                        /* eslint-disable */
                        if (payload.hasOwnProperty(key)) {
                            const hiddenField = document.createElement('input');
                            hiddenField.type = 'hidden';
                            hiddenField.name = key;
                            hiddenField.value = payload[key];

                            form.appendChild(hiddenField);
                        }
                    }

                    document.body.appendChild(form);
                    form.submit();
                    form.remove();
                }

                const toRemoveWidth = ['#content', '#phrasing_wrapper', '.phrasing_condition_line', '#container', '.ojad_title_oval', '.phrasing_condition_line label'];

                const toDelete = [];

                for (const selector of toRemoveWidth) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        element.style.setProperty('min-width', '0');
                        element.style.setProperty('width', '100%');
                    }
                }

                for (const selector of toDelete) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        element.remove();
                    }
                }

                scrollToSelector('#phrasing_main');

                migakuParse();
            };

            if (document.readyState !== 'loading') {
                onLoad();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    onLoad();
                });
            }
        }

        const colorizerSubtitle = async (selector, callback = () => {}) => {
            const subtitleElement = document.querySelector(selector);
            
            if (subtitleElement) {                    
                await new Promise((resolve) => {
                    // const subtitle = subtitleElement.textContent;
                    chrome.storage.local.get(KANJI_VIEW_SETTINGS.SUBTITLE_COLORING, (storage) => {
                        const doSubtitleColoring = !!storage[KANJI_VIEW_SETTINGS.SUBTITLE_COLORING];
                        if (doSubtitleColoring) {
                            performMigakuParse(subtitleElement).then(() => {
                                resolve();
                                callback(true);
                            });
                        } else {
                            resolve();
                            callback(false);
                        }
                    });
                })
            }

            setTimeout(() => {
                colorizerSubtitle(selector, callback);
            }, 1000 / 30)
        }

        if (window.location.host === new URL(VIDEO_STREAMING_PLATFORM_URL[VIDEO_STREAMING_PLATFORM.ANIMELON]).host) {
            
            const onLoad = () => {
                let previousInjectScript;

                colorizerSubtitle('#libjassVideoCover', () => {
                    if (previousInjectScript) {
                        previousInjectScript.remove();
                    }

                    const s = document.createElement('script');
                    s.setAttribute('type', 'text/javascript');
                    s.innerHTML = `window.getPhraseHovered = () => {}; window.clearTextHighlight = () => {};`
                    document.querySelector("body").append(s);
                    previousInjectScript = s;
                });
            };

            if (document.readyState !== 'loading') {
                onLoad();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    onLoad();
                });
            }
        }

        if (window.location.host === new URL(VIDEO_STREAMING_PLATFORM_URL[VIDEO_STREAMING_PLATFORM.YOUTUBE]).host) {
            
            const onLoad = () => {
                colorizerSubtitle('.captions-text');
            };

            if (document.readyState !== 'loading') {
                onLoad();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    onLoad();
                });
            }
        }
        yomichan.ready();
    } catch (e) {
        log.error(e);
    }
})();
