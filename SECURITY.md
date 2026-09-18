# Security and sensitive information

Do not report credentials, private repository details, or exploitable sensitive information in a public issue. Use GitHub private vulnerability reporting when it is enabled, or contact the maintainer through a private channel before sharing sensitive details. No private-reporting capability is assumed enabled by this file.

Skills are instructions, not security boundaries. Curated tools may execute code, access browsers, or use credentials. Review the exact source and required permissions in a disposable environment. This catalog does not install or execute them.

Builds must never execute scripts discovered inside submitted skill content. Website Markdown and build dependencies still require code review; a static site generator is not a sandbox for untrusted contributions.

If a secret enters public Git history, rotate or revoke it first; hiding the card or deleting the latest file is insufficient. Coordinate history cleanup rather than force-pushing autonomously.
