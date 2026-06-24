import type { ComponentMap } from '../types'
import { Text }       from '../components/Text'
import { Button }     from '../components/Button'
import { Badge }      from '../components/Badge'
import { Tag }        from '../components/Tag'
import { Avatar }     from '../components/Avatar'
import { Spinner }    from '../components/Spinner'
import { Divider }    from '../components/Divider'
import { Card }       from '../components/Card'
import { Stack }      from '../components/Stack'
import { Grid }       from '../components/Grid'
import { Input }      from '../components/Input'
import { Textarea }   from '../components/Textarea'
import { Select }     from '../components/Select'
import { Toggle }     from '../components/Toggle'
import { Checkbox }   from '../components/Checkbox'
import { Slider }     from '../components/Slider'
import { Modal }      from '../components/Modal'
import { TopBar }     from '../components/TopBar'
import { Sidebar }    from '../components/Sidebar'
import { NavItem }    from '../components/NavItem'
import { Tabs }       from '../components/Tabs'
import { Breadcrumb } from '../components/Breadcrumb'
import { Table }      from '../components/Table'
import { EmptyState } from '../components/EmptyState'

export const defaultRegistry: ComponentMap = {
  Text, Button, Badge, Tag, Avatar, Spinner, Divider,
  Card, Stack, Grid, Input, Textarea, Select,
  Toggle, Checkbox, Slider, Modal,
  TopBar, Sidebar, NavItem, Tabs, Breadcrumb, Table, EmptyState,
}
