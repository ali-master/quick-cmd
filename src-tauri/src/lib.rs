use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};
use tauri_plugin_positioner::{Position, WindowExt};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn show_window<R: Runtime>(app: tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        println!("Force showing window");
        window.show().unwrap();
        window.set_focus().unwrap();
    }
}

#[tauri::command]
fn toggle_window<R: Runtime>(app: tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        let is_visible = window.is_visible().unwrap_or(false);
        println!("Window visible: {}", is_visible);
        
        if is_visible {
            println!("Hiding window");
            window.hide().unwrap();
        } else {
            println!("Showing window");
            window.move_window(Position::TopCenter).unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
    } else {
        println!("Window not found!");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {
            // Create system tray menu
            let quit = MenuItem::with_id(app, "quit", "Quit QuickCMD", true, None::<&str>)?;
            let show = MenuItem::with_id(app, "show", "Show QuickCMD", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;

            // Create system tray
            let _tray = TrayIconBuilder::with_id("main")
                .tooltip("QuickCMD - Click to open")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    println!("Tray event: {:?}", event);
                    match event {
                        TrayIconEvent::Click {
                            button: MouseButton::Left,
                            ..
                        } => {
                            let app = tray.app_handle();
                            toggle_window(app.clone());
                        }
                        _ => {}
                    }
                })
                .on_menu_event(|app, event| {
                    println!("Menu event: {:?}", event.id);
                    match event.id.as_ref() {
                        "quit" => {
                            app.exit(0);
                        }
                        "show" => {
                            toggle_window(app.clone());
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            println!("System tray created successfully");
            println!("Tray icon should now be visible in menubar");

            // Hide dock icon on macOS
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            // Initially hide the window after setup
            if let Some(window) = app.get_webview_window("main") {
                window.hide().unwrap();
            }

            Ok(())
        })
        // Temporarily disable auto-hide on focus loss to prevent immediate closure
        // .on_window_event(|window, event| {
        //     if let tauri::WindowEvent::Focused(focused) = event {
        //         if !focused {
        //             window.hide().unwrap();
        //         }
        //     }
        // })
        .invoke_handler(tauri::generate_handler![greet, toggle_window, show_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
