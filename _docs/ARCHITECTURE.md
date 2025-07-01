# Architecture & Diagrams

This document contains architectural diagrams to visualize component structures and data flows within the Momento application.

## 1. Component Hierarchy: EventDetailScreen

This diagram illustrates the composition of the `EventDetailScreen`, showing how it uses various sub-components based on the state of the event (Upcoming, Arrival, or Post-Event).

[![](https://mermaid.ink/svg/pako:eNqdU8FuwjAM_RXlZYuWDRhwK3RUOsZp2m5wGqYkJLaJ2EEOSZTfXwpJlE7apEm-9_vj2IcOegQ7GCO0NfWAKjO-7R2GfV4fV1K4C70L8bQWvjC-v5W8T416J4wD2411eGgXf98b671eFpUeS_uB96yv_G9oU0vOa-lqJ4_f4e_778fP3j5jR_Gg_l3Wz2_Bq4I2-D9l-E5S5eQYJ6WbI3iA-mH9wU4rQy5vUa6hE75l45jU6k5e_58wDkE-w8N1Q2j1G2kC2F4S09c95-Jj0Vd8v1qGgR0K-SjM8m4e0v0Yd0cR5wQW_T3LdDB0zKjJ7z63B5kM171oQ3x6Y4o1kQ92nK8H02k4Nn9F9cWbWkHjVpT4HlY86f-Yw54mJk5hH21I7U_M_hD1Xn_hX8g7z4z-UjYqD59r6649vBHY0fI5hGj6gM8xRzP6D3_C8Rzz4i8B_B1l3l6xP5L1C4gP4D9L3j2hC_24rXbO4iWz0sW6lqC2QvV-w-qKkLZA9X7D_K_h2yB6v2H5f2O7JHq_YflY_d4)](#)

## 2. Data Flow: Invitation Process

This sequence diagram details the end-to-end process of a user receiving an event invitation, accepting it, completing payment, and getting confirmed for the event.

[![](https://mermaid.ink/svg/pako:eNqdVU1vgzAM_SuCnqokBqgNGtA-9MQeadtNCw4h2eIAsZGThE3w75cAJ52mdgkhP_f7vO-d8NBDcYA0RlsDXlSFl-Z1i_5evWwqlfL5e9mC_j18Pq7SjU_QOqY_621t4dO-_vH82e752_X1131v3S5f2-9z-U6-t3_j93v_v-8-x_o4P0_7k35t8T16S_iX-v1_Xf_q9L-Hn10cR_gR8D7p-2t1aV9O2gH-x2wM46J6rW9iW5mR5jU_D11q7G2e_WqY7d_l0yWlO2_yTj1yY_w-Ua996-5Jt9-iX8-e-n24c7F55c7yS5P44T4S2zQc2K2a3TId_h_g5p-Tf2l2xT4-eUf8f2MOMz6b5Sfe-L0F-rYw2qO8eQyN8WbI-bT69-I-a_xP17vP9u_c9b78H8i_84L78H8i_o8h74v_T1g_5b76-yv-F8gfiL7L6fX31v1_5v6nsv6_g_WPs_wP6P2X_Z-z_A_o_Yf9n7P8D-v8C5jJ2dw)](#)

## 3. UI Architecture: Role-Based Navigation & Mode Switching

To provide a focused and intuitive experience for all user types, Momento's UI will be **role-based**. A user's account can have different roles (`Participant`, `Host`), and the app's interface, particularly the main tab bar navigation, will adapt to the role they are currently acting in.

This architecture solves the challenge of a user who is both a participant and a host, preventing cognitive overload by ensuring they only see the tools relevant to their current goal.

There are three primary user types:

1.  **Social-Only User (`Participant`)**: The default user who attends events. Their UI is focused on discovery and connection.
2.  **Host-Only User (`Community Host`)**: A business or organization whose goal is to create and manage events. Their UI is a streamlined professional dashboard. They do not have social features like a Memory Book.
3.  **Hybrid User (`User Host`)**: An individual who both hosts and participates in events. This user has access to both UI paradigms.

### The "Mode Switcher"

The lynchpin of this design is the **"Mode Switcher,"** a clear control within the `Profile` tab that allows a Hybrid User to toggle between "Social Mode" and "Host Mode."

- **Social Mode**: The UI is identical to the Social-Only user's experience.
- **Host Mode**: The UI transforms into the professional dashboard identical to the Host-Only user's experience.

This approach ensures that single-role users have a simple, dedicated experience, while hybrid users have the power to switch contexts without clutter.

[![](https://mermaid.ink/svg/pako:eNqNVM1vgzAM_R_Fp9ZJBqwNGrA-9MQeadtNGw5JsuIAsZFThk3w75cAJ52mdmkhP_f7vO-d8NB9cYA0plsDXlSFl-Z1i35evWwqlfL5e9mC_j18Pq7SjU_QOqY_621t4dO-_vH82e752_X1131v3S5f2-9z-U6-t3_j93v_v-8-x_o4P0_7k35t8T16S_iX-v1_Xf_q9L-Hn10cR_gR8D7p-2t1aV9O2gH-x2wM46J6rW9iW5mR5jU_D11q7G2e_WqY7d_l0yWlO2_yTj1yY_w-Ua996-5Jt9-iX8-e-n24c7F55c7yS5P44T4S2zQc2K2a3TId_h_g5p-Tf2l2xT4-eUf8f2MOMz6b5Sfe-L0F-rYw2qO8eQyN8WbI-bT69-I-a_xP17vP9u_c9b78H8i_84L78H8i_o8h74v_T1g_5b76-yv-F8gfiL7L6fX31v1_5v6nsv6_g_WPs_wP6P2X_Z-z_A_o_Yf9n7P8D-v8Cg753MA)](#)
